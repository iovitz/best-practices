import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { SQLITE_CLIENT } from 'src/db/db.module'
import { User } from 'src/schema'

@Injectable()
export class UserService {
  @Inject(SQLITE_CLIENT)
  sqliteClient: BetterSQLite3Database

  getUserList(offset: number, limit: number) {
    return this.sqliteClient.select().from(User).limit(limit).offset(offset)
  }

  getUserById(id: number) {
    return this.sqliteClient.select().from(User).where(eq(User.id, id))
  }

  createUser(user: typeof User.$inferInsert) {
    return this.sqliteClient.insert(User).values(user)
  }
}
