import rc from 'rc'

export const AppConfig: Readonly<AppConfig> = mergeProcessEnvConfig(rc('server'))

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
  get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return AppConfig[key]
  }
}

export const config = new Config()
