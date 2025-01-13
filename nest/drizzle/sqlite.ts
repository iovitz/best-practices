import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/drizzle/sqlite.drizzle.ts',
  out: './drizzle/sqlite-out',
  dbCredentials: {
    url: 'data.db',
  },
})
