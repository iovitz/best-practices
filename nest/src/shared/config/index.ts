import process from 'node:process'
import rc from 'rc'

const AppName = process.env.npm_package_name ?? 'nestapp'

const defaultConfig = {
  APP_PORT: process.env.PORT ?? 3333,

  SWAGGER_ENABLE: true,

  ENCRYPT_AES_ENCRYPT_KEY: '',

  LOG_LEVEL: 'info',
  // 是否启用压缩
  LOG_ZIPPED_ARCHIVE: true,
  LOG_MAX_SIZE: '30M',
  LOG_MAX_FILES: '3d',
  LOG_CONSOLE_LOGGING: true,
  LOG_DATA_PATTERN: 'DD-MM-YYYY',

  NEST_APP_ENV_SESSION_SECRET: 'ngK3ksUQ9ITvNKX1fTHs4',

  NEST_APP_ENV_REDIS_DB_URL: '127.0.0.1',
  NEST_APP_ENV_REDIS_DB_PORT: 6379,
  NEST_APP_ENV_REDIS_DB_USER: void 0,
  NEST_APP_ENV_REDIS_DB_PSWD: '123123',

  NEST_APP_ENV_PRISMA_SQLITE_DB_FILE: '/sqlite/NEST_APP_PRISMA.db',

  NEST_APP_ENV_PRISMA_MYSQL_CONNECT_URL: 'mysql://nest_db_prisma:iNop7B9BBDOAwyIY@mysql.sqlpub.com:3306/nest_db_prisma',

  NEST_APP_ENV_TYPEORM_SQLITE_DB_FILE: 'sqlite/NEST_APP_TYPEORM.db',
  NEST_APP_ENV_TYPEORM_SQLITE_DB_SYNC: true,

  NEST_APP_ENV_TYPEORM_MYSQL_DB_HOST: 'mysql.sqlpub.com',
  NEST_APP_ENV_TYPEORM_MYSQL_DB_PORT: 3306,
  NEST_APP_ENV_TYPEORM_MYSQL_DB_NAME: 'nest_db_typeorm',
  NEST_APP_ENV_TYPEORM_MYSQL_DB_USER: 'nest_db_typeorm',
  NEST_APP_ENV_TYPEORM_MYSQL_DB_PSWD: '9AWwCAQhAgUtlQZg',
  NEST_APP_ENV_TYPEORM_MYSQL_DB_SYNC: 'off',

  NEST_APP_ENV_DRIZZLE_MYSQL_CONNECT_URL: 'postgres://nest_db_drizzle:AK8vdjpyquG63vcz@mysql.sqlpub.com:3306/nest_db_drizzle',

  NEST_APP_ENV_Mongoose_MONGO_DB_HOST: 'mysql.sqlpub.com',
  NEST_APP_ENV_Mongoose_MONGO_DB_PORT: 3306,
  NEST_APP_ENV_Mongoose_MONGO_DB_NAME: 'nest_app_mysql',
  NEST_APP_ENV_Mongoose_MONGO_DB_USER: 'nest_app_mysql',
  NEST_APP_ENV_Mongoose_MONGO_DB_PSWD: 'db_pswd',
}

type ConfigType = typeof defaultConfig

export const RcConfig: Readonly<ConfigType> = rc(AppName, defaultConfig)

export class Config {
  get<T extends keyof ConfigType>(key: T): ConfigType[T] {
    return RcConfig[key]
  }
}

export const config = new Config()
