import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const mysqlDemos = mysqlTable('demos', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
})
