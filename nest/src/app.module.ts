import * as process from 'node:process'
import { CacheModule } from '@nestjs/cache-manager'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
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
import { DatabaseModule } from './database/database.module'
import { HomeModule } from './home/home.module'
import { ServicesModule } from './services/services.module'
import { Tracer } from './services/tracer/tracer.service'
import { SocketV1Module } from './socketv1/socketv1.module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ServicesModule,
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 3 * 1000,
      max: 10,
    }),
    SocketV1Module,
    HomeModule,
    BookModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatterInterceptor,
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
  private tracer = new Tracer(AppModule.name)

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
