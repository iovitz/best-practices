import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('user', {
  id: integer().primaryKey({
    autoIncrement: true,
  }),
  email: text().unique().notNull(),
  password: text().notNull(),
})
