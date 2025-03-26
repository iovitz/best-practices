import rc from 'rc'

const AppName = process.env.npm_package_name ?? 'nestapp'

const defaultConfig = {
  APP_NAME: 'nest-app',
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

  MYSQL_CONNECTION_URL: 'mysql://nest_db_typeorm:9AWwCAQhAgUtlQZg@mysql.sqlpub.com:3306/nest_db_typeorm',
  SQLITE_DB_FILE_NAME: 'sqlite-dev.db',

}

type ConfigType = typeof defaultConfig

export const AppConfig: Readonly<ConfigType> = mergeProcessEnvConfig(rc(AppName, defaultConfig))

/**
 * 合并环境变量
 */
function mergeProcessEnvConfig(config: ConfigType) {
  Object.keys(config).forEach((k) => {
    if (process.env[k]) {
      config[k] = process.env[k]
    }
  })
  return config
}

export class Config {
  get<T extends keyof ConfigType>(key: T): ConfigType[T] {
    return AppConfig[key]
  }
}

export const config = new Config()
