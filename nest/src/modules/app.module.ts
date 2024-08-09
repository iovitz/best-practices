import {
  Inject,
  LoggerService,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerModule } from './logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env', // 默认配置文件
        process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod', // 环境配置文件
      ],
      load: [
        () => ({
          ...process.env,
          isProd: process.env.NODE_ENV !== 'dev',
          NODE_ENV: process.env.NODE_ENV ?? 'prod',
        }),
      ],
    }),
    DbModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    SocketModule,
    UserModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
