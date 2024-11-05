import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { SQLITE_CLIENT } from 'src/db/db.module'
import { Book } from 'src/db/sqlite.schema'

@Injectable()
export class BookService {
  @Inject(SQLITE_CLIENT)
  sqliteClient: BetterSQLite3Database

  getBookList(page: number, limit: number) {
    return this.sqliteClient.select().from(Book).limit(limit).offset((page - 1) * limit)
  }

  getBookById(id: number) {
    return this.sqliteClient.select().from(Book).where(eq(Book.id, id))
  }

  createBook(data: typeof Book.$inferInsert) {
    return this.sqliteClient.insert(Book).values(data)
  }
}
