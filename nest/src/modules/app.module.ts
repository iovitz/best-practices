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
import { TracerMiddleware } from 'src/aspects/middlewares/tracer/tracer.middleware';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Module({
  imports: [GlobalModule, SocketModule, UserModule],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new TracerMiddleware(this.logger).use).forRoutes('*');
  }
}
