import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
})
