import { join } from 'node:path'
import { AppConfig } from '../../../shared/config'
import { DataSource, DataSourceOptions } from 'typeorm'
console.log(join(__dirname, '*.entity{.ts,.js}'))

export default new DataSource({
  type: 'mysql',
  url: AppConfig.NEST_APP_ENV_TYPEORM_MYSQL_URL,
  migrationsTableName: "typeorm_migration",
  // 实体路径
  entities: [join(__dirname, '*.entity{.ts,.js}')],
  // 迁移文件路径
  migrations: [join(__dirname, 'migrations', '*-migration{.ts,.js}')],
})
