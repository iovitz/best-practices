import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'prisma/config'
import { AppConfig } from 'src/shared/config'

process.env.DATABASE_URL = `file:${join(homedir(), 'sqlite', AppConfig.DRIZZLE_DB_FILE_NAME)}`

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: 'src/database/prisma-sqlite/sqlite.prisma',
  },
})
