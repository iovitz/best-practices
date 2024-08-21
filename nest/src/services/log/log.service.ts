import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { ChildLoggerOptions, Logger } from 'pino';

interface LogContext {
  ex?: Error;
  req?: Request;
  res?: Response;
  [key: string]: unknown;
}

class BaseLog implements LoggerService {
  constructor(private logger: Logger) {}

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
    this.logger.info(this.formatContext(context), message);
  }
  error(message: any, context?: LogContext) {
    this.logger.error(this.formatContext(context), message);
  }
  warn(message: any, context?: LogContext) {
    this.logger.warn(this.formatContext(context), message);
  }
  debug(message: any, context?: LogContext) {
    this.logger.debug(this.formatContext(context), message);
  }
  verbose(message: any, context?: string) {
    this.logger.info(this.formatContext(context), message);
  }

  child(bindings: pino.Bindings, options?: ChildLoggerOptions<never>) {
    return new BaseLog(this.logger.child(bindings, options));
  }
}

@Injectable()
export class LogService extends BaseLog {
  constructor(private config: ConfigService) {
    const logger = pino({
      // 配置 Pino
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy/MM/dd HH:mm:ss.l',
        },
      },
      serializers: {
        ex(ex: LogContext['ex']) {
          return {
            key: ex.message,
            name: ex.name,
            stack: ex.stack,
          };
        },
      },
      base: {},
    });
    super(logger);
  }
}
