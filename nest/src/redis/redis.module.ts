import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TracerService } from 'src/util/tracer/tracer.service'
// import Redis from 'ioredis'

export const REDIS_CLIENT = Symbol('REDIS_CLIENT')

@Module({
  providers: [{
    provide: REDIS_CLIENT,
    inject: [ConfigService, TracerService],
    useFactory: async (configService: ConfigService, tracer: TracerService) => {
      const redisUrl = configService.getOrThrow('APP_NAME_REDIS_CONNECTION_URL')
      // const redis = new Redis(configService.getOrThrow('APP_NAME_REDIS_CONNECTION_URL'))
      // await redis.ping()
      // return redis
      tracer.log(redisUrl, 'REDIS')
      return redisUrl
    },
  }],
  exports: [REDIS_CLIENT],
})
export class RedisModule {
}
