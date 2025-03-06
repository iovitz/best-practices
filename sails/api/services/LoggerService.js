/**
 * LoggerService
 *
 * @description :: 日志模块
 * @usage       :: LoggerService.[methodName]()
 */

class LoggerService {
  constructor(scope) {
    this.logger = scope ? rootLogger.child({ scope }) : rootLogger
  }

  fatal(message, context) {
    this.logger.fatal(message, context)
  }

  bootstrap(message, context) {
    this.logger.bootstrap(message, context)
  }

  error(message, context) {
    this.logger.error(message, context)
  }

  warn(message, context) {
    this.logger.warn(message, context)
  }

  info(message, context) {
    this.logger.info(message, context)
  }

  /**
   * @deprecated 使用 `tracer.info` 替代，这个方法只给NestJS内部调用
   * @param message
   * @param context
   */
  log(message, context) {
    this.logger.info(message, context)
  }

  verbose(message, context) {
    this.logger.verbose(message, context)
  }

  debug(message, context) {
    this.logger.debug(message, context)
  }

  child(scope) {
    return new LoggerService(scope)
  }
}

const loggerService = new LoggerService('APP')

// For LSP
globalThis.LoggerService = loggerService

module.exports = loggerService
