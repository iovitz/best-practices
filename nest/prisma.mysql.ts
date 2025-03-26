import { defineConfig } from 'prisma/config'
import { AppConfig } from 'src/shared/config'

process.env.DATABASE_URL = AppConfig.MYSQL_CONNECTION_URL
export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: 'src/database/prisma-mysql/mysql.prisma',
  },
})
