import { Global, Module } from '@nestjs/common'
import { DrizzleModule } from './drizzle/drizzle.module'
import { TypeormModule } from './typeorm/typeorm.module'
import { PrismaMysqlService } from './prisma-mysql/prisma-mysql.service'
import { PrismaSqliteService } from './prisma-sqlite/prisma-sqlite.service'

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
  providers: [PrismaMysqlService, PrismaSqliteService],
  exports: [PrismaMysqlService, PrismaSqliteService],
})
export class DatabaseModule {}
