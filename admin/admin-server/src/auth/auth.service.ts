import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MysqlService } from 'src/db/mysql/mysql.service';
import { User, UserProfile } from '@prisma/client-mysql';
import { PickProps } from 'src/shared/types/utils';
import { MD5 } from 'crypto-js';
import { Details } from 'express-useragent';
import * as moment from 'moment';

type UserFindFirstParams = Parameters<MysqlService['user']['findFirst']>[0];

@Injectable()
export class AuthService {
  constructor(private mysql: MysqlService) {}

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

  findUserBy(
    where: UserFindFirstParams['where'],
    select: UserFindFirstParams['select'] = {},
  ) {
    return this.mysql.user.findFirst({
      where,
      select,
    });
  }

  createUser(
    user: PickProps<User, 'email' | 'password'>,
    userProfile: PickProps<UserProfile, 'realName', 'homepath'>,
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
          // 默认昵称为用户名
          username: userProfile.realName,
          ...userProfile,
        },
      }),
    ]);
  }
  genSessionId(userId: string, env?: Details) {
    const session = this.sessionIdGenerator();
    this.mysql.session.create({
      data: {
        userId,
        id: session,
        os: env?.os,
        browser: env?.browser,
        browserVersion: env?.version,
        useragent: env?.source,
        expiredAt: moment().add(1, 'M').toDate(),
      },
    });
    return session;
  }
}
