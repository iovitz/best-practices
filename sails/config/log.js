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
  debug: chalk.gray,
  info: chalk.blue,
  warn: chalk.orange,
  error: chalk.red,
}

function getOutputFormatter(isProd) {
  return function (logInfo) {
    if (isProd) {
      return `${logInfo.pid} ${logInfo.timestamp} ${[logInfo.scope]} ${logInfo.level} ${logInfo.message} ${logInfo.context || ''}`
    }
    const logLevelColor = levelColorMap[logInfo.level] ?? chalk.gray
    return `${chalk.gray(logInfo.pid)} ${chalk.gray(logInfo.timestamp)} ${[chalk.gray(logInfo.scope)]} ${logLevelColor(logInfo.level)} ${logInfo.message} ${logInfo.context || ''}`
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
  defaultMeta: {
    pid: process.pid,
  },
})
rootLogger.add(consoleTransport)
rootLogger.add(getFileLoggingTransport('info'))
rootLogger.add(getFileLoggingTransport('warn'))
rootLogger.add(getFileLoggingTransport('error'))

const customLogger = rootLogger.child({
  scope: 'APP',
})

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
