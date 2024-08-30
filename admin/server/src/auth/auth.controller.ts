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
    @Body(VerifyPipe) user: LoginDTO,
    @Request() req: Req,
    @Tracer() tracer: TracerService,
  ) {
    tracer.log('收到登录请求', {
      ...user,
    });
    const existsUser = await this.auth.findUserBy(
      {
        email: user.email,
      },
      {
        id: true,
        password: true,
      },
    );
    if (!existsUser) {
      throw new BadRequestException('User not exists!');
    }
    if (existsUser.password !== MD5(user.password).toString()) {
      throw new BadRequestException('Invalid Password!');
    }
    const ua = req.headers['user-agent'];
    const uaDetail = this.auth.getUAParser(ua);
    const session = await this.auth.createSession({
      userId: existsUser.id,
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
      id: existsUser.id,
      token: session,
    };
  }

  @Post('create')
  async createUser(
    @Body(VerifyPipe) user: CreateUserDTO,
    @Tracer() tracer: TracerService,
  ) {
    tracer.log('创建用户', {
      ...user,
    });
    const [_user, userProfile] = await this.auth.createUser(
      {
        email: user.email,
        password: user.password,
      },
      {
        realName: user.realName,
        homepath: user.homepath,
      },
    );
    return {
      id: userProfile.id,
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
