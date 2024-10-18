import { isEmpty, omit } from 'lodash';
import 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';
import { LEVEL, SPLAT, MESSAGE } from 'triple-beam';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import * as chalk from 'chalk';
import * as stringify from 'json-stringify-safe';

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

export function createRootLogger(level: string) {
  const rootLogger = createLogger({
    transports: [
      new transports.Console({
        level,
        // 使用时间戳和nest样式
        format: format.combine(
          format.timestamp({ format: 'HH:mm:ss.SSS' }),
          format.colorize(),
          format.printf((info: LogInfo) => {
            if (!info) return '';
            const {
              timestamp,
              level,
              message,
              name,
              scope,
              stack,
              payload,
              ...rest
            } = omit(info, ERROR, SPLAT, LEVEL, MESSAGE);
            // 错误日志特别输出
            const restStr = isEmpty(rest) ? '' : stringify(rest);
            return `${chalk.gray(timestamp)} ${level}${insertOutput(scope, chalk.red)}${insertOutput(name, chalk.blue)}${insertOutput(message, chalk.cyan)}${insertOutput(payload)}${insertOutput(
              stack,
            )}${insertOutput(restStr)}`;
          }),
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
  return rootLogger.child({
    pid: process.pid,
  });
}

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

function insertOutput(v: unknown, chalk?: chalk.Chalk) {
  if (!v) return '';
  const content = typeof v === 'object' ? stringify(v) : v;
  return ` ${chalk ? chalk(content) : content}`;
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
  const restStr = isEmpty(rest) ? '' : stringify(rest);
  return `${[timestamp]}${insertOutput(pid)} ${level}${insertOutput(scope)}${insertOutput(name)}${insertOutput(message)}${insertOutput(payload)}${insertOutput(
    stack,
  )}${insertOutput(restStr)}`;
}
