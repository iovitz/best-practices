import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogService } from './services/log/log.service';
import { SocketV1Module } from './socketv1/socketv1.module';
import { ServicesModule } from './services/services.module';

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
    ServicesModule,
    EventEmitterModule.forRoot(),
    DbModule,
    SocketV1Module,
    UserModule,
  ],
  providers: [AppService],
  exports: [],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(private log: LogService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
