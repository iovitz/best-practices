import { defineConfig } from 'drizzle-kit'
import { AppConfig } from './src/shared/config'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/database/drizzle-mysql/model.ts',
  out: 'migrations/drizzle-mysql',
  dbCredentials: {
    url: AppConfig.MYSQL_CONNECTION_URL,
  },
})
