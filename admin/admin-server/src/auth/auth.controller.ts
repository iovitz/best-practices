import { Body, Controller, Post } from '@nestjs/common';
import { TracerService } from 'src/services/tracer/tracer.service';
import { Public } from 'src/shared/decorator/public';
import { Tracer } from 'src/shared/decorator/tracer';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() user: CreateUserDto, @Tracer() tracer: TracerService) {
    tracer.log('收到登录请求', {
      ...user,
    });
    const session = this.auth.genSessionId();
    return {
      token: session,
    };
  }

  @Post('create-user')
  createUser(@Body() user: CreateUserDto, @Tracer() tracer: TracerService) {
    tracer.log('创建用户', {
      ...user,
    });
    const session = this.auth.genSessionId();
    return {
      token: session,
    };
  }
}
