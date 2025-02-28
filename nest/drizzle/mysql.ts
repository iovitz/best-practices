import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/database/drizzle/mysql.drizzle.ts',
  out: './drizzle/mysql-out',
  dbCredentials: {
    url: process.env.NEST_APP_ENV_DRIZZLE_MYSQL_CONNECT_URL,
  },
})
