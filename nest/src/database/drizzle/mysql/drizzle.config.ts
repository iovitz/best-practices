import { defineConfig } from 'drizzle-kit'
import { join } from 'node:path'
import { AppConfig } from 'src/shared/config'

export default defineConfig({
  dialect: 'mysql',
  schema: join(__dirname, 'model.ts'),
  out: join(__dirname, 'migrate'),
  dbCredentials: {
    url: AppConfig.NEST_APP_ENV_DRIZZLE_MYSQL_CONNECT_URL,
  },
})
