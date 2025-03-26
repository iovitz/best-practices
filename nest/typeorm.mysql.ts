import { AppConfig } from './src/shared/config'
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'mysql',
  url: AppConfig.MYSQL_CONNECTION_URL,
  migrationsTableName: 'typeorm_migration',
  // 实体路径
  entities: ['src/database/typeorm-mysql/*.entity{.ts,.js}'],
  // 迁移文件路径
  migrations: ['migrations/typeorm-mysql/*-migration{.ts,.js}'],
})
