import { homedir } from 'node:os'
import path from 'node:path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from 'src/services/config/config.service'
import { getTypeOrmLogger } from './typeorm.logger'

@Module({

  imports: [
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          url: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_URL'),
          entities: [path.join(__dirname, 'mysql', '*.entity{.ts,.js}')], // 实体路径
          synchronize: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_SYNC') === 'on',
          logging: true,
          logger: getTypeOrmLogger('Typeorm-Mysql'),
        }
      },
    }),

    TypeOrmModule.forRootAsync({
      name: 'sqlite',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: path.join(homedir(), configService.get('NEST_APP_ENV_TYPEORM_SQLITE_DB_FILE')),
          entities: [path.join(__dirname, 'sqlite', '*.entity{.ts,.js}')], // 实体路径
          autoLoadEntities: true,
          synchronize: configService.get('NEST_APP_ENV_TYPEORM_SQLITE_DB_SYNC'),
          logging: true,
          logger: getTypeOrmLogger('Typeorm-Sqlite'),
        }
      },
    }),
  ],
  exports: [],
})
export class TypeormModule {}
