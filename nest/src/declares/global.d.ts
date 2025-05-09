import type ConfigJSONType from '../config/default.json'
import { Request, Response } from 'express'
import { SyncManager } from '../services/sync-manager/sync-manager'
import { Tracer } from '../services/tracer/tracer.service'

declare global {
  interface MiddlewareInjected {
    // 中间注入的对象，不一定真的存在，注意调用时间
    startNs: bigint
    clientId: string
    tracerId: string
    syncManager: SyncManager
    tracer: Tracer
    getCostNs: () => string
    getCookie: (key: CookieKeys) => string | undefined
    setCookie: (key: CookieKeys, value: string) => void
  }
  interface Req extends Request, MiddlewareInjected {
    user?: any
    userId?: string
  }
  interface Res extends Response, MiddlewareInjected {}

  // 往原始类型上增加类型
  namespace Express {
    export interface Request {}
    export interface Response {}
  }

  type ConfigType = ConfigJSONType
  const __isProd: boolean
}
