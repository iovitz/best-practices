import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketV1Module } from './socketv1/socketv1.module';
import { ServicesModule } from './services/services.module';
import { TracerMiddleware } from './aspects/middlewares/tracer/tracer.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatterInterceptor } from './aspects/interceptors/response-formatter/response-formatter.interceptor';
import { ParamsExceptionFilter } from './aspects/filters/params-exception/params-exception.filter';
import { HttpExceptionFilter } from './aspects/filters/http-exception/http-exception.filter';
import { InternalExceptionFilter } from './aspects/filters/internal-exception/internal-exception.filter';
import { TracerService } from './services/tracer/tracer.service';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatterInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: InternalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ParamsExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
  exports: [],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(
    private config: ConfigService,
    private tracer: TracerService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    this.tracer.log('Initial middlewares');
    consumer
      .apply(
        cookieParser(),
        session({
          secret: this.config.getOrThrow('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
        }),
        TracerMiddleware,
      )
      .forRoutes('*');
  }
}
