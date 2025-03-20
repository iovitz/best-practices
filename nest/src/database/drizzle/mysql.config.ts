import { defineConfig } from 'drizzle-kit'
import { AppConfig } from 'src/shared/config'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/database/drizzle/mysql.model.ts',
  out: './src/database/drizzle/mysql-migrate',
  dbCredentials: {
    url: AppConfig.NEST_APP_ENV_DRIZZLE_MYSQL_CONNECT_URL,
  },
})
