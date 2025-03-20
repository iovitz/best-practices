import { defineConfig } from 'drizzle-kit'

export default defineConfig({

  dialect: 'mysql',
  schema: './src/database/drizzle/mysql.model.ts',
  out: './src/database/drizzle/mysql-migrate',
  dbCredentials: {
    url: process.env.NEST_APP_ENV_DRIZZLE_MYSQL_CONNECT_URL,
  },
})
