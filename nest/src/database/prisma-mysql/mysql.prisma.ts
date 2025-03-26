import { defineConfig } from 'prisma/config'
import { AppConfig } from 'src/shared/config'

process.env.DATABASE_URL = AppConfig.NEST_APP_ENV_PRISMA_MYSQL_CONNECT_URL

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: './schema.prisma',
  },
})
