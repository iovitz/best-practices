import { Global, Module } from '@nestjs/common'
// import { RedisModule } from '@nestjs-modules/ioredis'

@Global()
@Module({
  imports: [
    // RedisModule.forRootAsync({
    //   useFactory: () => ({
    //     type: 'single',
    //     url: '<REDIS_CONNECTION_URL>',
    //     options: {
    //       password: 'REDIS_PASSWORD',
    //     },
    //   }),
    // }),
  ],
})
export class DatabaseModule {}
