import { defineConfig } from 'drizzle-kit'
import { join } from 'node:path'

export default defineConfig({
  dialect: 'sqlite',
  schema: join(__dirname, 'model.ts'),
  out: join(__dirname, 'migrate'),
  dbCredentials: {
    url: 'data.db',
  },
})
