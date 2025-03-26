import { defineConfig } from 'drizzle-kit'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { AppConfig } from 'src/shared/config'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/drizzle-sqlite/model.ts',
  out: 'migrations/drizzle-sqlite',
  dbCredentials: {
    url: join(homedir(), 'sqlite', AppConfig.SQLITE_DB_FILE_NAME),
  },
})
