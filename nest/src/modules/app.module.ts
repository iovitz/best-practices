import {
  Inject,
  LoggerService,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestTracerInterceptor } from 'src/aspects/interceptors/request-tracer/request-tracer.interceptor';

@Module({
  imports: [GlobalModule, SocketModule, UserModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTracerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
