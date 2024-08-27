import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
} from '@nestjs/common';
import { TracerService } from 'src/services/tracer/tracer.service';
import { Public } from 'src/shared/decorator/public';
import { Tracer } from 'src/shared/decorator/tracer';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';
import { ValidationPipe } from 'src/aspects/pipes/validation/validation.pipe';
import { MD5 } from 'crypto-js';
import * as UAParser from 'ua-parser-js';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public()
  @Post('login')
  async login(
    @Body(ValidationPipe) user: CreateUserDto,
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
    const uaObj = new UAParser(ua);
    // const env = {
    //   browser: uaObj.getBrowser().name,
    //   browserVersion: uaObj.getBrowser().version,
    //   os: uaObj.getOS().name,
    //   osVersion: uaObj.getOS().version,
    //   ua,
    // };
    console.log({
      id: existsUser.id,
      os: uaObj.getOS().name,
      osVersion: uaObj.getOS().version,
      engine: uaObj.getEngine().name,
      browser: uaObj.getBrowser().name,
      browserVersion: uaObj.getBrowser().version,
      deviceModel: uaObj.getDevice().model,
      deviceVendor: uaObj.getDevice().vendor,
      useragent: uaObj.getUA(),
    });
    const session = await this.auth.createSession({
      userId: existsUser.id,
      os: uaObj.getOS().name,
      osVersion: uaObj.getOS().version,
      engine: uaObj.getEngine().name,
      browser: uaObj.getBrowser().name,
      browserVersion: uaObj.getBrowser().version,
      deviceModel: uaObj.getDevice().model,
      deviceVendor: uaObj.getDevice().vendor,
      useragent: uaObj.getUA(),
    });
    return {
      token: session,
    };
  }

  @Post('create')
  async createUser(
    @Body(ValidationPipe) user: CreateUserDto,
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
}
