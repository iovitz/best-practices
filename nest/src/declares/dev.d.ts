/**
 * 开发时的类型
 */
import type ConfigFile from '../../.serverrc.sample.json'

type ConfigFileType = typeof ConfigFile

declare global {
  interface AppConfig extends ConfigFileType {}
}
