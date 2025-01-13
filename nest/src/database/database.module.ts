import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisModule } from '@nestjs-modules/ioredis'
import { SqliteModule } from './drizzle/sqlite/sqlite.module'
import { TypeormModule } from './typeorm/typeorm.module'

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ({
          type: 'single',
          url: configService.getOrThrow('NEST_APP_ENV_REDIS_DB_URL'),
          options: {
            port: Number(configService.getOrThrow('NEST_APP_ENV_REDIS_DB_PORT')) || 6709,
            username: configService.getOrThrow('NEST_APP_ENV_REDIS_DB_USER'),
            password: configService.getOrThrow('NEST_APP_ENV_REDIS_DB_PSWD'),
          },
        })
      },
    }),
    SqliteModule,
    TypeormModule,
  ],
})
export class DatabaseModule {}
