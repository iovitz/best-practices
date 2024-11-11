import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/sqlite/sqlite.schema.ts',
  dbCredentials: {
    url: 'data.db',
  },
})
