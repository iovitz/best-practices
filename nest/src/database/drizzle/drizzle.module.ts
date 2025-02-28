import { Global, Module } from '@nestjs/common'
import Database from 'better-sqlite3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { ConfigService } from 'src/services/config/config.service'

export const DRIZZLE_SQLITE = Symbol('DRIZZLE_SQLITE')
export const DRIZZLE_MYSQL = Symbol('DRIZZLE_MYSQL')

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_SQLITE,
      inject: [ConfigService],
      useFactory: async () => {
        const client = new Database('data.db')
        return drizzleSqlite({ client })
      },
    },
    {
      provide: DRIZZLE_MYSQL,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection = await mysql.createConnection({
          uri: configService.get('NEST_APP_ENV_DRIZZLE_MYSQL_CONNECT_URL'),
        })
        const db = drizzle({ client: connection })
        return db
      },
    },
  ],
  exports: [DRIZZLE_SQLITE, DRIZZLE_MYSQL],
})
export class DrizzleModule {}
