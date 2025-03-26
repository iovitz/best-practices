import { join } from 'node:path'
import { defineConfig } from 'prisma/config'
import { AppConfig } from 'src/shared/config'

process.env.DATABASE_URL = AppConfig.DRIZZLE_SQLITE_FILE
process.env.MIGRATIONS_PATH = join(__dirname, 'migrate/prisma-sqlite')
console.error(process.env.MIGRATIONS_PATH)

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: 'src/database/prisma-sqlite/sqlite.prisma',
  },
})
