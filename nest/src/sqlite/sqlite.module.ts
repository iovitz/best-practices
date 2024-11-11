import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

export const SQLITE_CLIENT = Symbol('SQLITE_CLIENT')

@Module({
  providers: [{
    provide: SQLITE_CLIENT,
    inject: [ConfigService],
    useFactory: async () => {
      const client = new Database('data.db')
      return drizzle({ client })
    },
  }],
  exports: [SQLITE_CLIENT],
})
export class SqliteModule {
}
