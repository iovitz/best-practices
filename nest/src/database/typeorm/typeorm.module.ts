import { homedir } from 'node:os'
import path from 'node:path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from 'src/services/config/config.service'
import { appLogger } from 'src/services/tracer/tracer'
import { Logger } from 'typeorm'

@Module({

  imports: [

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          name: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_NAME'),
          host: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_HOST'),
          port: Number(configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_PORT')),
          username: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_USER'),
          password: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_PSWD'),
          database: configService.get('NEST_APP_ENV_TYPEORM_MYSQL_DB_NAME'),
          entities: [path.join(__dirname, 'mysql', '*.entity{.ts,.js}')], // 实体路径
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
})
export class TypeormModule {}

function getTypeOrmLogger(name: string) {
  const typeormTracer = appLogger.child({
    scope: name,
  })

  const logger: Logger = {
    logQuery(query: string) {
      typeormTracer.debug(query)
    },
    logQueryError(error: string | Error, query: string) {
      typeormTracer.error(query, error)
    },
    logQuerySlow(time: number, query: string) {
      typeormTracer.log('Query Slow', { time, query })
    },
    logSchemaBuild(message: string) {
      typeormTracer.debug(`Schema Build: ${message}`)
    },
    logMigration(message: string) {
      typeormTracer.debug(`Schema Build: ${message}`)
    },
    log(level: 'log' | 'info' | 'warn', message: any) {
      typeormTracer.debug('LOG', message)
    },
  }
  return logger
}
