import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isObject } from 'lodash';
import { SPLAT } from 'triple-beam';
import 'winston-daily-rotate-file';
import { Logger, createLogger, format, transports } from 'winston';
import * as chalk from 'chalk';

interface LogContext {
  ex?: Error;
  req?: Request;
  res?: Response;
  [key: string]: unknown;
}

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

  formatObject(param: unknown, indent = false) {
    if (param instanceof Error) {
      return param.stack.split('\n').join('\\n');
    }
    if (isObject(param)) {
      try {
        if (indent) {
          return JSON.stringify(param, null, 2);
        }
        return JSON.stringify(param);
      } catch (e) {
        return param;
      }
    }
    return param;
  }

  formatInfo(info, indent = false): Format {
    const splat = info[SPLAT] || [];
    const message = this.formatObject(info.message, indent);
    const rest = splat.map(this.formatObject).join(' \\n ');

    info.message = `${message}`;
    if (!isEmpty(rest)) {
      info.message += ` ${rest}`;
    }
    return info;
  }

  getConsoleTransport() {
    return new transports.Console({
      level: 'debug',
      // 使用时间戳和nest样式
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.printf((i) => {
          this.formatInfo(i);
          console.log(i);
          const t = i.timestamp;
          const { message } = i;
          return `${[t]} ${i.level} ${i.name ? `(${i.name}) ` : ''}${message} ${i.context || ''}`;
        }),
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
      format.printf((i) => {
        this.formatInfo(i);
        const t = i.timestamp;
        const { message } = i;
        return `${[t]} ${i.level} ${i.name} ${message} ${i.context || ''}`;
      }),
    ];
  }

  private formatContext(context?: LogContext | string) {
    if (!context) return {};
    if (typeof context === 'string') {
      return {
        name: context,
      };
    }
    return {
      ...context,
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
