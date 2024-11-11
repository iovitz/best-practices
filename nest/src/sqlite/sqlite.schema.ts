import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const Book = sqliteTable('book', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text({ length: 20 }).notNull(),
})
