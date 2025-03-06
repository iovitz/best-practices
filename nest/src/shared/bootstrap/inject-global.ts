/* eslint-disable import/first */

// @ts-expect-error Global Variable
globalThis.__isProd = process.env.NODE_ENV === 'production'

import { Tracer } from '../tracer/tracer'

export const appTracer = new Tracer('APP')

// 防止未捕获异常导致进程退出
process.on('unhandledRejection', (reason: Error) => {
  appTracer.fatal('### Unhandle Rejection Promise', reason)
})

process.on('uncaughtException', (error) => {
  appTracer.fatal('### Unhandle Exception', error)
})
