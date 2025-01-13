import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { DRIZZLE_SQLITE } from 'src/database/drizzle/drizzle.module'
import { User } from 'src/database/drizzle/sqlite.drizzle'

@Injectable()
export class BookService {
  @Inject(DRIZZLE_SQLITE)
  sqliteClient: BetterSQLite3Database

  getBookList(page: number, limit: number) {
    return this.sqliteClient.select().from(User).limit(limit).offset((page - 1) * limit)
  }

  getBookById(id: number) {
    return this.sqliteClient.select().from(User).where(eq(User.id, id))
  }

  createBook(data: typeof User.$inferInsert) {
    return this.sqliteClient.insert(User).values(data)
  }
}
