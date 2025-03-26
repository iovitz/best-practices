import { defineConfig } from 'drizzle-kit'
import { AppConfig } from 'src/shared/config'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/drizzle-sqlite/model.ts',
  out: 'migrations/drizzle-sqlite',
  dbCredentials: {
    url: AppConfig.DRIZZLE_SQLITE_FILE,
  },
})
