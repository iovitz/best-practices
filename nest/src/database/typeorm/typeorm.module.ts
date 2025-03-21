import { homedir } from 'node:os'
import path from 'node:path'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from 'src/services/config/config.service'
import { getTypeOrmLogger } from './typeorm.logger'
import { TypeormMysqlDemo } from './mysql/demo.entity'

@Global()
@Module({

  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          // name: 'db1',
          host: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_HOST'),
          port: Number(configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_PORT')),
          username: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_USER'),
          password: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_PSWD'),
          database: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_NAME'),
          entities: [TypeormMysqlDemo], // 实体路径
          synchronize: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_SYNC') === 'on',
          logging: true,
          logger: getTypeOrmLogger('Typeorm-Mysql'),
        }
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'better-sqlite3',
          name: 'sqlite',
          database: path.join(homedir(), configService.get('NEST_APP_ENV_TYPEORM_SQLITE_DB_FILE')),
          entities: [path.join(__dirname, 'sqlite', '*.entity{.ts,.js}')], // 实体路径
          autoLoadEntities: true,
          synchronize: configService.get('NEST_APP_ENV_TYPEORM_SQLITE_DB_SYNC'),
          logging: true,
          logger: getTypeOrmLogger('Typeorm-Sqlite'),
        }
      },
    }),
    // TypeOrmModule.forFeature([TypeormMysqlDemo]),
  ],
})
export class TypeormModule {}
