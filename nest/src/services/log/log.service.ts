import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';
import 'winston-daily-rotate-file';
import { Logger, createLogger, format, transports } from 'winston';

const ERROR = Symbol('ERROR');

type LogContext =
  | Error
  | {
      ex?: Error;
      req?: Request;
      res?: Response;
      [key: string]: unknown;
    };

type Format = ReturnType<typeof format.timestamp>;

class BaseLog implements LoggerService {
  logger: Logger;
  constructor(logger?: Logger) {
    this.logger = logger ?? this.createRootLogger();
  }

  createRootLogger() {
    const logger = createLogger({
      transports: [
        this.getConsoleTransport(),
        this.getInfoTransport(),
        this.getErrorTransport(),
      ],
    });
    return logger.child({
      pid: process.pid,
    });
  }

  insertOutput(v) {
    return v ? ` ${v}` : '';
  }

  formatOutput = (info) => {
    if (!info) return '';
    const { timestamp, level, pid, name, message, traceInfo } = info;
    // 错误日志特别输出
    if (info[ERROR]) {
      return `${[timestamp]} [${pid}] ${level} ${this.insertOutput(traceInfo)}${this.insertOutput(message)} ${info.stack}`;
    }
    return `${[timestamp]} [${pid}] ${level} ${this.insertOutput(traceInfo)}${this.insertOutput(name)} ${message}`;
  };

  getConsoleTransport() {
    return new transports.Console({
      level: 'debug',
      // 使用时间戳和nest样式
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.printf(this.formatOutput),
      ),
    });
  }

  getInfoTransport() {
    return new transports.DailyRotateFile({
      dirname: 'logs/info',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: format.combine(...this.getCommonFormat()),
    });
  }

  getErrorTransport() {
    return new transports.DailyRotateFile({
      dirname: 'logs/error',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: format.combine(...this.getCommonFormat()),
    });
  }

  getCommonFormat(): Format[] {
    return [
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.printf(this.formatOutput),
    ];
  }

  private formatContext(context?: LogContext | string) {
    if (!context) return {};
    if (context instanceof Error) {
      return {
        [ERROR]: true,
        name: context.message ?? get(context, 'message'),
        stack: context.stack?.split('\n').join('\\n'),
        cause: context.cause,
      };
    }
    if (typeof context === 'object') {
      return context;
    }
    return {
      name: context,
    };
  }

  log(message: any, context?: LogContext) {
    this.logger.info(message, this.formatContext(context));
  }
  error(message: any, context?: LogContext) {
    this.logger.error(message, this.formatContext(context));
  }
  warn(message: any, context?: LogContext) {
    this.logger.warn(message, this.formatContext(context));
  }
  debug(message: any, context?: LogContext) {
    this.logger.debug(message, this.formatContext(context));
  }
  verbose(message: any, context?: string) {
    this.logger.info(message, this.formatContext(context));
  }

  child(option: unknown) {
    return new BaseLog(this.logger.child(option));
  }
}

@Injectable()
export class LogService extends BaseLog {
  constructor(private config: ConfigService) {
    super();
  }
}
