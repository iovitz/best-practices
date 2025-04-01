import { homedir } from 'node:os'
import { join } from 'node:path'
import { DataSource } from 'typeorm'
import { AppConfig } from './src/shared/config'

export default new DataSource({
  type: 'better-sqlite3',
  database: join(homedir(), 'sqlite', AppConfig.SQLITE_DB_FILE_NAME),
  migrationsTableName: 'typeorm_migration',
  // 实体路径
  entities: ['src/database/typeorm-sqlite/*.entity{.ts,.js}'],
  // 迁移文件路径
  migrations: ['migrations/typeorm-sqlite/*-migration{.ts,.js}'],
})
