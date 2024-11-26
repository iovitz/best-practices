import * as process from 'node:process'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import * as cookieParser from 'cookie-parser'
import { BadRequestFilter } from './aspects/filters/bad-request/bad-request.filter'
import { DefaultFilter } from './aspects/filters/default/default.filter'
import { HttpFilter } from './aspects/filters/http/http.filter'
import { LogInterceptor } from './aspects/interceptors/log/log.interceptor'
import { PreparePromiseInterceptor } from './aspects/interceptors/prepare-promise/prepare-promise.interceptor'
import { ResponseFormatterInterceptor } from './aspects/interceptors/response-formatter/response-formatter.interceptor'
import { InjectUtilsMiddleware } from './aspects/middlewares/inject-utils/inject-utils.middleware'
import { BookModule } from './book/book.module'
import { HomeModule } from './home/home.module'
import { RedisModule } from './redis/redis.module'
import { SocketV1Module } from './socketv1/socketv1.module'
import { SqliteModule } from './sqlite/sqlite.module'
import { TracerService } from './util/tracer/tracer.service'
import { UtilModule } from './util/util.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
      // 开发环境才加载配置数据
      ['production'].includes(process.env.NODE_ENV) ? [] : ['.env.development'],
      load: [
        // 可以加载远程配置
        async () => {
          const isProd = process.env.NODE_ENV === 'prod'

          return {
            isProd,
          }
        },
      ],
    }),
    EventEmitterModule.forRoot(),
    UtilModule,
    RedisModule,
    SqliteModule,
    SocketV1Module,
    HomeModule,
    BookModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatterInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PreparePromiseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private config: ConfigService,
    private tracer: TracerService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    this.tracer.log('Initial middlewares')
    consumer
      .apply(
        cookieParser(),
        // middleware中主要用来注入工具函数
        InjectUtilsMiddleware,
      )
      .forRoutes('*')
  }
}
