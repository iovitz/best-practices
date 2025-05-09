import { homedir } from 'node:os'
import { join } from 'node:path'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PrismaClient as PrismaMysqlClient } from '@prisma/client-mysql'
import { PrismaClient as PrismaSqliteClient } from '@prisma/client-sqlite'
import Database from 'better-sqlite3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { ConfigService } from 'src/services/config/config.service'
import { getTypeOrmLogger } from './typeorm.logger'

export { PrismaClient as PrismaMysqlClient } from '@prisma/client-mysql'

export { PrismaClient as PrismaSqliteClient } from '@prisma/client-sqlite'

export const PRISMA_SQLITE = Symbol('PRISMA_SQLITE')
export const PRISMA_MYSQL = Symbol('PRISMA_MYSQL')
export const DRIZZLE_SQLITE = Symbol('DRIZZLE_SQLITE')
export const DRIZZLE_MYSQL = Symbol('DRIZZLE_MYSQL')

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

    TypeOrmModule.forRootAsync({
      name: 'mysql',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          url: configService.get('MYSQL_CONNECTION_URL'),
          entities: [join(__dirname, 'typeorm-mysql', '*.entity{.ts,.js}')], // 实体路径
          synchronize: false,
          logging: true,
          logger: getTypeOrmLogger('TypeORM-Mysql'),
        }
      },
    }),

    TypeOrmModule.forRootAsync({
      name: 'sqlite',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: join(homedir(), 'sqlite', configService.get('SQLITE_DB_FILE_NAME')),
          entities: [join(__dirname, 'typeorm-sqlite', '*.entity{.ts,.js}')], // 实体路径
          autoLoadEntities: true,
          synchronize: false,
          logging: true,
          logger: getTypeOrmLogger('TypeORM-Sqlite'),
        }
      },
    }),
  ],
  providers: [
    {
      provide: DRIZZLE_SQLITE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = new Database(join(homedir(), 'sqlite', configService.get('SQLITE_DB_FILE_NAME')))
        return drizzleSqlite({ client })
      },
    },
    {
      provide: DRIZZLE_MYSQL,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection = await mysql.createConnection({
          uri: configService.get('MYSQL_CONNECTION_URL'),
        })
        const db = drizzle({ client: connection })
        return db
      },
    },
    {
      provide: PRISMA_SQLITE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = new PrismaSqliteClient({
          datasourceUrl: `file:${join(homedir(), 'sqlite', configService.get('SQLITE_DB_FILE_NAME'))}`,
        })
        await client.$connect()
        return client
      },
    },
    {
      provide: PRISMA_MYSQL,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = new PrismaMysqlClient({
          datasourceUrl: configService.get('MYSQL_CONNECTION_URL'),
        })
        await client.$connect()
        return client
      },
    },
  ],
  exports: [PRISMA_MYSQL, PRISMA_SQLITE, DRIZZLE_MYSQL, DRIZZLE_SQLITE],
})
export class DatabaseModule {}
