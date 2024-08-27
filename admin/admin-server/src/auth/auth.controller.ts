import { Body, Controller, Post } from '@nestjs/common';
import { TracerService } from 'src/services/tracer/tracer.service';
import { Public } from 'src/shared/decorator/public';
import { Tracer } from 'src/shared/decorator/tracer';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';
import { ValidationPipe } from 'src/aspects/pipes/validation/validation.pipe';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public()
  @Post('login')
  login(
    @Body(ValidationPipe) user: CreateUserDto,
    @Tracer() tracer: TracerService,
  ) {
    tracer.log('收到登录请求', {
      ...user,
    });
    const session = this.auth.genSessionId();
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
