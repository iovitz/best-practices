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

const { createLogger, format, transports } = require('winston');
const chalk = require('chalk');
require('winston-daily-rotate-file');

const { SPLAT } = require('triple-beam');

function formatObject(param) {
  if (param instanceof Error) {
    return param.stack.split('\n').join('\\n');
  }
  if (_.isObject(param)) {
    return JSON.stringify(param);
  }
  return param;
}

// Ignore log messages if they have { private: true }
const all = format((info) => {
  const splat = info[SPLAT] || [];
  const message = formatObject(info.message);
  const rest = splat.map(formatObject).join('\\n');

  info.message = `${message}`;
  if (!_.isEmpty(rest)) {
    info.message += ` ${rest}`;
  }
  return info;
});

const consoleTransport = new transports.Console({
  level: 'debug',
  // 使用时间戳和nest样式
  format: format.combine(
    all(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf((i) => {
      const t = chalk.gray(i.timestamp);
      const message = chalk.blue(i.message);
      return `${[t]} ${i.level} ${message} ${i.context || ''}`;
    }),
  ),
});

const infoTransport = new transports.DailyRotateFile({
  dirname: 'logs/info',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: format.combine(
    all(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf((i) => {
      const t = i.timestamp;
      const { message } = i;
      return `${[t]} ${i.level} ${message} ${i.context || ''}`;
    }),
  ),
});

const errorTransport = new transports.DailyRotateFile({
  dirname: 'logs/error',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: format.combine(
    all(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf((i) => {
      const t = i.timestamp;
      const { message } = i;
      return `${[t]} ${i.level} ${message} ${i.context || ''}`;
    }),
  ),
});

const customLogger = createLogger({
  transports: [consoleTransport, infoTransport, errorTransport],
});
module.exports.log = {

  custom: customLogger,

  inspect: false,

  /** *************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ************************************************************************** */

  // level: 'info'
};
