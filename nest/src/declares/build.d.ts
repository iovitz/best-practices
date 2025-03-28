/**
 * 打包时的类型
 */
import 'express'

declare global {
  interface AppConfig {
    [key: string]: any
  }
}
