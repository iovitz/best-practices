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
import { EncryptService } from './services/encrypt/encrypt.service';
import { VerifyService } from './services/verify/verify.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env', // 默认配置文件
        // 选择配置类型
        ['prod', 'pre'].includes(process.env.APP_NAME_NODE_ENV)
          ? '.env.prod'
          : '.env.dev', // 环境配置文件
      ],
      load: [
        // 可以加载远程配置
        async () => {
          const isProd = process.env.NODE_ENV === 'prod';
          const isPre = process.env.NODE_ENV === 'pre';
          const isDev = process.env.NODE_ENV === 'dev';
          const isOnline = isProd || isPre;

          return {
            isProd,
            isPre,
            isDev,
            isOnline,
            ...process.env,
          };
        },
      ],
    }),
    DbModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    SocketModule,
    UserModule,
  ],
  // 全局使用的一些Service
  providers: [EncryptService, VerifyService, AppService],
  exports: [],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
