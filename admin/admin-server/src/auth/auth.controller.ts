import { Body, Controller, Post, Response } from '@nestjs/common';
import { TracerService } from 'src/services/tracer/tracer.service';
import { Public } from 'src/shared/decorator/public';
import { Tracer } from 'src/shared/decorator/tracer';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public()
  @Post('login')
  login(
    @Body() user,
    @Tracer() tracer: TracerService,
    @Response({ passthrough: true }) res: Res,
  ) {
    tracer.log('收到Login请求', user);
    const session = this.auth.genSessionId();
    res.cookie;
    return {
      token: session,
    };
  }
}
