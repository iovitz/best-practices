import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const drizzleSqliteDemos = sqliteTable('drizzle-demos', {
  id: integer().primaryKey({
    autoIncrement: true,
  }),
  name: text({ length: 255 }).notNull(),
})
