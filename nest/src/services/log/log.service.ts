import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as chalk from 'chalk';
import { Logger, createLogger, format, transports } from 'winston';
import { SPLAT } from 'triple-beam';
import 'winston-daily-rotate-file';
import { isEmpty, isObject } from 'lodash';

type Format = ReturnType<typeof format.timestamp>;

@Injectable()
export class LogService implements LoggerService {
  private logger: Logger;

  constructor(private config: ConfigService) {
    this.logger = createLogger({
      transports: [
        this.getConsoleTransport(),
        this.getInfoTransport(),
        this.getErrorTransport(),
      ],
    });
  }

  formatObject(param: unknown, indent = false) {
    if (param instanceof Error) {
      return param.stack.split('\n').join('\\n');
    }
    if (isObject(param)) {
      if (indent) {
        return JSON.stringify(param, null, 2);
      }
      return JSON.stringify(param);
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
          const t = chalk.gray(i.timestamp);
          const message = chalk.blue(i.message);
          return `${[t]} ${i.level} ${message} ${i.context || ''}`;
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
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.printf((i) => {
          this.formatInfo(i);
          const t = i.timestamp;
          const { message } = i;
          return `${[t]} ${i.level} ${message} ${i.context || ''}`;
        }),
      ),
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
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.printf((i) => {
          this.formatInfo(i);
          const t = i.timestamp;
          const { message } = i;
          return `${[t]} ${i.level} ${message} ${i.context || ''}`;
        }),
      ),
    });
  }

  formatContext(context: unknown) {
    if (context !== null && typeof context === 'object') {
      return {
        ...context,
      };
    }
    return context;
  }

  log(message: any, context?: unknown) {
    this.logger.info(message, this.formatContext(context));
  }
  error(message: any, context?: unknown) {
    this.logger.error(message, this.formatContext(context));
  }
  warn(message: any, context?: unknown) {
    this.logger.warn(message, this.formatContext(context));
  }
  debug(message: any, context?: unknown) {
    this.logger.debug(message, this.formatContext(context));
  }
  verbose(message: any, context?: unknown) {
    this.logger.verbose(message, this.formatContext(context));
  }
}
