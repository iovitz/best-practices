/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */

const chalk = require('chalk')
const { stringify } = require('safe-stable-stringify')
const { createLogger, format, transports } = require('winston')

require('winston-daily-rotate-file')

const { SPLAT } = require('triple-beam')

function formatObject(param) {
  if (param instanceof Error) {
    return param.stack.split('\n').join('\\n')
  }
  if (_.isObject(param)) {
    return stringify(param)
  }
  return param
}

// Ignore log messages if they have { private: true }
const all = format((info) => {
  const splat = info[SPLAT] ?? []
  const message = formatObject(info.message)
  const rest = splat.map(formatObject).join('\\n')
  // console.log(info)
  info.message = `${message}`
  if (!_.isEmpty(rest)) {
    info.message += ` ${rest}`
  }
  return info
})

// 定义自定义日志级别
const customLevels = {
  levels: {
    fatal: 50,
    notice: 51,
    bootstrap: 99,
    error: 100,
    warn: 200,
    info: 300,
    http: 400,
    verbose: 500,
    debug: 600,
    silly: Number.MAX_SAFE_INTEGER,
  },
}

const consoleTransport = new transports.Console({
  level: 'debug',
  // 使用时间戳和nest样式
  format: format.combine(
    all(),
    format.timestamp({ format: 'HH:mm:ss.SSS' }),
    format.printf(getOutputFormatter(false)),
  ),
})

const levelColorMap = {
  fatal: chalk.magentaBright, // 进程错误
  bootstrap: chalk.green, // 启动日志
  error: chalk.red, // 业务错误
  warn: chalk.yellow, // 业务警告
  info: chalk.blue, // 业务日志
  http: chalk.cyanBright, // http日志
  verbose: chalk.black, // 调试日志
  debug: chalk.blackBright, // 啊我额发我额发我额发我
}

function getOutputFormatter(isProd) {
  return function (logInfo) {
    if (isProd) {
      return `${logInfo.pid} ${logInfo.timestamp} ${[logInfo.scope]} ${logInfo.level} ${logInfo.message} ${logInfo.context || ''}`
    }
    const logLevelColor = levelColorMap[logInfo.level] ?? chalk.gray
    return `${chalk.gray(logInfo.pid)} ${chalk.gray(logInfo.timestamp)} ${[chalk.gray(logInfo.scope ?? 'GLOBAL')]} ${logLevelColor(logInfo.level)} ${logInfo.message} ${logInfo.context || ''}`
  }
}

function getCommonOutput() {
  return [
    all(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf(getOutputFormatter(true)),
  ]
}

function getFileLoggingTransport(level) {
  return new transports.DailyRotateFile({
    dirname: `logs/${level}`,
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level,
    format: format.combine(...getCommonOutput()),
  })
}

globalThis.rootLogger = createLogger({
  level: 'info',
  levels: customLevels.levels,
  defaultMeta: {
    pid: process.pid,
  },
})
rootLogger.fatal('123123')
rootLogger.bootstrap('123123')
rootLogger.error('123123')
rootLogger.warn('123123')
rootLogger.info('123123')
rootLogger.http('123123')
rootLogger.verbose('123123')
rootLogger.debug('123123')
rootLogger.silly('123123')

rootLogger.add(consoleTransport)
rootLogger.add(getFileLoggingTransport('info'))
rootLogger.add(getFileLoggingTransport('warn'))
rootLogger.add(getFileLoggingTransport('error'))

const customLogger = rootLogger.child({
  scope: 'APP',
})
customLogger.fatal('123123')
customLogger.bootstrap('123123')
customLogger.error('123123')
customLogger.warn('123123')
customLogger.info('123123')
customLogger.http('123123')
customLogger.verbose('123123')
customLogger.debug('123123')
customLogger.silly('123123')

module.exports.log = {

  custom: customLogger,

  inspect: false,

  /**
   * *************************************************************************
   *
   * Valid `level` configs: i.e. the minimum log level to capture with        *
   * sails.log.*()                                                            *
   *
   * The order of precedence for log levels from lowest to highest is:        *
   * silly, verbose, info, debug, warn, error                                 *
   *
   * You may also set the level to "silent" to suppress all logs.             *
   *
   **************************************************************************
   */

  level: 'silly',
}
