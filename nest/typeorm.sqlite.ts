import { join } from 'node:path'
import { AppConfig } from './src/shared/config'
import { DataSource } from 'typeorm'
import { homedir } from 'node:os'

export default new DataSource({
  type: 'better-sqlite3',
  database: join(homedir(), 'sqlite', AppConfig.DRIZZLE_DB_FILE_NAME),
  migrationsTableName: 'typeorm_migration',
  // 实体路径
  entities: ['src/database/typeorm-sqlite/*.entity{.ts,.js}'],
  // 迁移文件路径
  migrations: ['migrations/typeorm-sqlite/*-migration{.ts,.js}'],
})
