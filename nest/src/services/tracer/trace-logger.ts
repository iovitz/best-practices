import { isEmpty, omit } from 'lodash';
import 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';
import { LEVEL, SPLAT, MESSAGE } from 'triple-beam';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

const ERROR = Symbol('ERROR');

type Format = ReturnType<typeof format.timestamp>;

interface LogInfo {
  name?: string;
  pid?: number;
  traceInfo?: string;
  msgPrefix?: string;
  stack?: string;
  payload?: string;
  [key: string | symbol]: unknown;
}

export const rootLogger = createLogger({
  transports: [
    new transports.Console({
      level: 'debug',
      // 使用时间戳和nest样式
      format: format.combine(
        format.timestamp({ format: 'YY-MM-DD HH:mm:ss.SSS' }),
        format.colorize(),
        format.printf(formatOutput),
      ),
    }),
    new transports.DailyRotateFile({
      dirname: 'logs/info',
      level: 'info',
      ...getCommonRotateFileOption(),
    }),
    new transports.DailyRotateFile({
      dirname: 'logs/warn',
      level: 'warn',
      ...getCommonRotateFileOption(),
    }),
    new transports.DailyRotateFile({
      dirname: 'logs/error',
      level: 'error',
      ...getCommonRotateFileOption(),
    }),
  ],
});

function getCommonStyleFormat(): Format[] {
  return [
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf(formatOutput),
  ];
}
function getCommonRotateFileOption(): DailyRotateFileTransportOptions {
  return {
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(...getCommonStyleFormat()),
  };
}

function insertOutput(v: unknown) {
  if (!v) return '';
  if (typeof v === 'object') {
    return ` ${JSON.stringify(v)}`;
  }
  return ` ${v}`;
}

function formatOutput(info: LogInfo) {
  if (!info) return '';
  const {
    timestamp,
    level,
    message,
    name,
    pid,
    scope,
    stack,
    payload,
    ...rest
  } = omit(info, ERROR, SPLAT, LEVEL, MESSAGE);
  // 错误日志特别输出
  let restStr = '';
  if (rest && !isEmpty(rest)) {
    try {
      restStr = JSON.stringify(rest);
    } catch (e) {
      rootLogger.error('Log Rest Info Stringify fail', e);
    }
  }
  return `${[timestamp]}${insertOutput(pid)} ${level}${insertOutput(scope)}${insertOutput(name)}${insertOutput(message)}${insertOutput(payload)}${insertOutput(
    stack,
  )}${insertOutput(restStr)}`;
}
