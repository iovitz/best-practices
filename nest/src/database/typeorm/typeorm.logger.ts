import { rootLogger } from 'src/shared/tracer/logger'
import { Logger } from 'typeorm'

export function getTypeOrmLogger(name: string) {
  const typeormTracer = rootLogger.child({
    scope: name,
  })

  const logger: Logger = {
    logQuery(query: string) {
      typeormTracer.info(query)
    },

    logQueryError(error: string | Error, query: string) {
      typeormTracer.error(query, error)
    },

    logQuerySlow(time: number, query: string) {
      typeormTracer.info('Query Slow', { time, query })
    },

    logSchemaBuild(message: string) {
      typeormTracer.debug(`Schema Build: ${message}`)
    },

    logMigration(message: string) {
      typeormTracer.info(`Schema Build: ${message}`)
    },

    log(level: 'log' | 'info' | 'warn', message: any) {
      typeormTracer.debug('LOG', message)
    },
  }
  return logger
}
