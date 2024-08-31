import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { TracerService } from 'src/services/tracer/tracer.service';
import { Public } from 'src/shared/decorator/public';
import { Tracer } from 'src/shared/decorator/tracer';
import { AuthService } from './auth.service';
import { CreateUserDTO, GetCodeDTO, LoginDTO } from './auth.dto';
import { MD5 } from 'crypto-js';
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public()
  @Post('login')
  async login(
    @Body(VerifyPipe) body: LoginDTO,
    @Request() req: Req,
    @Tracer() tracer: TracerService,
  ) {
    tracer.log('收到登录请求', {
      ...body,
    });
    console.log(req.session);
    if (!this.auth.checkVerifyCode(req.session, 'login', body.code)) {
      throw new BadRequestException('验证码错误');
    }
    const user = await this.auth.findUserBy(
      {
        email: body.email,
      },
      {
        id: true,
        password: true,
      },
    );
    if (!user) {
      throw new BadRequestException('User not exists!');
    }
    if (user.password !== MD5(body.password).toString()) {
      throw new BadRequestException('Invalid Password!');
    }
    // const user =
    const ua = req.headers['user-agent'];
    const uaDetail = this.auth.getUAParser(ua);
    const userProfile = await this.auth.findUserProfileBy(
      {
        id: user.id,
      },
      {
        avatar: true,
        email: true,
        username: true,
      },
    );
    const session = await this.auth.createSession({
      userId: user.id,
      os: uaDetail.os.name,
      osVersion: uaDetail.os.version,
      engine: uaDetail.engine.name,
      browser: uaDetail.browser.name,
      browserVersion: uaDetail.browser.version,
      deviceModel: uaDetail.device.model,
      deviceVendor: uaDetail.device.vendor,
      useragent: ua,
    });
    return {
      id: user.id,
      token: session,
      avatar: userProfile.avatar,
      username: userProfile.email,
      nickname: userProfile.username,
      // 一个用户可能有多个角色
      roles: ['admin'],
      // 按钮级别权限
      permissions: ['*:*:*'],
      accessToken: 'eyJhbGciOiJIUzUxMiJ9.admin',
      refreshToken: 'eyJhbGciOiJIUzUxMiJ9.adminRefresh',
      expires: '2030/10/30 00:00:00',
    };
  }

  @Post('create')
  async createUser(
    @Body(VerifyPipe) body: CreateUserDTO,
    @Tracer() tracer: TracerService,
  ) {
    tracer.log('创建用户', {
      ...body,
    });
    const [user] = await this.auth.createUser(
      {
        password: body.password,
        email: body.email,
      },
      {
        username: body.username,
      },
    );
    return {
      id: user.id,
    };
  }

  @Get('code')
  getCode(@Query(VerifyPipe) query: GetCodeDTO, @Request() req: Req) {
    const { data, text } = this.auth.getVerifyCode(
      query.width,
      query.height,
      4,
      query.background,
    );

    req.session[`#c_${query.type}`] = text;
    req.session[`#t_${query.type}`] = Date.now();
    // res;
    return data;
  }
}
