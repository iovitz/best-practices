import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('user', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text({ length: 20 }).notNull(),
  age: integer({ mode: 'number' }).notNull(),
})
