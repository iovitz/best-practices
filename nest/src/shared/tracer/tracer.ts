import { LoggerService } from '@nestjs/common'
import { Logger } from 'winston'
import { appLogger, formatLogContext } from './logger'
import { LogContext } from './tracer.types'

export class Tracer implements LoggerService {
  private logger: Logger

  constructor(scope?: string) {
    this.logger = scope ? appLogger.child({ scope }) : appLogger
  }

  fatal(message: string, context?: LogContext) {
    (this.logger as any).fatal(message, formatLogContext(context))
  }

  bootstrap(message: string, context?: LogContext) {
    (this.logger as any).bootstrap(message, formatLogContext(context))
  }

  error(message: string, context?: LogContext) {
    this.logger.error(message, formatLogContext(context))
  }

  warn(message: string, context?: LogContext) {
    this.logger.warn(message, formatLogContext(context))
  }

  info(message: string, context?: LogContext) {
    this.logger.info(message, formatLogContext(context))
  }

  /**
   * @deprecated 使用 `tracer.info` 替代，这个方法只给NestJS内部调用
   * @param message
   * @param context
   */
  log(message: string, context?: LogContext) {
    this.logger.info(message, formatLogContext(context))
  }

  verbose(message: string, context?: LogContext) {
    this.logger.verbose(message, formatLogContext(context))
  }

  debug(message: string, context?: LogContext) {
    this.logger.debug(message, formatLogContext(context))
  }
}
