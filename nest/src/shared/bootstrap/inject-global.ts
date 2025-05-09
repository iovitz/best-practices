/* eslint-disable import/first */

// @ts-expect-error Global Variable
globalThis.__isProd = process.env.NODE_ENV === 'production'

import { Tracer } from '../tracer/tracer'

const appTracer = new Tracer('APP')

// 防止未捕获异常导致进程退出
process.on('unhandledRejection', (reason: Error) => {
  appTracer.error('### Unhandle Rejection Promise', reason)
})

process.on('uncaughtException', (error) => {
  appTracer.error('### Unhandle Exception', error)
})

setInterval(() => {
  const memoryUsage = process.memoryUsage()
  appTracer.info(`Memory Usage: ${memoryUsage.rss / 1024 / 1024} MB`)
}, 1000 * 10)
