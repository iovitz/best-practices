import { stringify } from 'safe-stable-stringify'
import { Tracer } from 'src/shared/tracer/tracer'
import { RcConfig } from '../config'

export type BootstrapFn = (appTracer: Tracer) => Promise<unknown>

export const appTracer = new Tracer('APP')

export async function startNestApp(bootstrapFN: BootstrapFn) {
  checkBootstrapEnv(appTracer)
  try {
    const startNs = process.hrtime.bigint()
    appTracer.info('APP Running Start', { time: new Date().toLocaleString() })
    await bootstrapFN(appTracer)
    const cost = Number(process.hrtime.bigint() - startNs).toLocaleString()
    appTracer.info('APP Running Success', { cost })
  }
  catch (e) {
    appTracer.error('### APP Exit With Error!!!!', e)
    process.exit(1)
  }
}

export function checkBootstrapEnv(appTracer: Tracer) {
  appTracer.bootstrap('Application Environment', { config: stringify(process.env) })
  appTracer.bootstrap('Application Config', { env: stringify(RcConfig) })
  if (!__isProd) {
    appTracer.bootstrap('App Not Running In Production Mode!!!')
  }
}
