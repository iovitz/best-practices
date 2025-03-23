import { Global, Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'
import { ConfigService } from 'src/services/config/config.service'
import { DrizzleModule } from './drizzle/drizzle.module'
import { TypeormModule } from './typeorm/typeorm.module'
import { TypeormMysqlDemo } from './typeorm/mysql/demo.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({
  imports: [
    // RedisModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return ({
    //       type: 'single',
    //       url: configService.get('NEST_APP_ENV_REDIS_DB_URL'),
    //       options: {
    //         port: Number(configService.get('NEST_APP_ENV_REDIS_DB_PORT')),
    //         username: configService.get('NEST_APP_ENV_REDIS_DB_USER'),
    //         password: configService.get('NEST_APP_ENV_REDIS_DB_PSWD'),
    //       },
    //     })
    //   },
    // }),
    TypeormModule,
    DrizzleModule,
  ],
})
export class DatabaseModule {}
