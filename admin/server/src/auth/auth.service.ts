import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MysqlService } from 'src/db/mysql/mysql.service';
import { User, UserProfile, Session } from '@prisma/client-mysql';
import { PickProps } from 'src/shared/types/utils';
import { MD5 } from 'crypto-js';
import * as moment from 'moment';
import { UAParser } from 'ua-parser-js';
import * as svgCaptcha from 'svg-captcha';

type FindUserParam = Parameters<MysqlService['user']['findFirst']>[0];
type FindUserProfileParam = Parameters<
  MysqlService['userProfile']['findFirst']
>[0];

@Injectable()
export class AuthService {
  constructor(private mysql: MysqlService) {}

  private uaParser = new UAParser();

  private userIdGenerator = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyz',
    9,
  );

  private sessionIdGenerator = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyz',
    30,
  );

  genUserId() {
    return 'u' + this.userIdGenerator();
  }

  findUserProfileBy(
    where: FindUserProfileParam['where'],
    select: FindUserProfileParam['select'] = {},
  ) {
    return this.mysql.userProfile.findFirst({
      where,
      select,
    });
  }
  findUserBy(
    where: FindUserParam['where'],
    select: FindUserParam['select'] = {},
  ) {
    return this.mysql.user.findFirst({
      where,
      select,
    });
  }

  getUAParser(useragent: string) {
    this.uaParser.setUA(useragent);
    return this.uaParser.getResult();
  }

  createUser(
    user: PickProps<User, 'email' | 'password'>,
    userProfile: PickProps<UserProfile, 'username'>,
  ) {
    const id = this.genUserId();
    const password = MD5(user.password).toString();
    return this.mysql.$transaction([
      this.mysql.user.create({
        data: {
          id,
          ...user,
          password,
        },
      }),
      this.mysql.userProfile.create({
        data: {
          id,
          email: user.email,
          // 默认昵称为用户名
          username: userProfile.username,
          ...userProfile,
        },
      }),
    ]);
  }

  async createSession(
    data: PickProps<
      Session,
      'userId',
      | 'engine'
      | 'browser'
      | 'browserVersion'
      | 'os'
      | 'osVersion'
      | 'useragent'
      | 'deviceModel'
      | 'deviceVendor'
    >,
  ) {
    const session = this.sessionIdGenerator();
    await this.mysql.session.create({
      data: {
        id: session,
        ...data,
        expiredAt: moment().add(1, 'M').toDate(),
      },
    });
    return session;
  }

  getVerifyCode(
    width: number,
    height: number,
    length = 4,
    background?: string,
  ) {
    const captcha = svgCaptcha.create({
      size: length, // 验证码长度
      ignoreChars: 'o01ijlaqf', // 忽略字符
      color: false, // 是否采用彩色字符串
      noise: Math.floor(Math.random() * 3), // 干扰线条
      width, // 图片宽
      height, // 图片长
      background,
    });
    return captcha;
  }

  checkVerifyCode(session: Req['session'], type: string, text: string) {
    // 获取验证码
    const code = session[`#c_${type}`] ?? '';
    const codeTime = session[`#t_${type}`] ?? '';
    // 判断验证码是不是30Min内下发的
    if (moment(codeTime).add(30, 'M') < moment(Date.now())) {
      return false;
    }
    if (text.toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    delete session[`#c_${type}`];
    delete session[`#t_${type}`];
    return true;
  }
}
