import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const drizzleMysqlDemos = mysqlTable('drizzle-demos', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
})
