import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/drizzle/sqlite.model.ts',
  out: './src/database/drizzle/sqlite-migrate',
  dbCredentials: {
    url: 'data.db',
  },
})
