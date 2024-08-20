import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { Logger } from 'pino';

@Injectable()
export class LogService implements LoggerService {
  logger: Logger;
  constructor(private config: ConfigService) {
    this.logger = pino({
      // 配置 Pino
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:mm:ss.l',
        },
      },
    });
  }

  log(message: any, context?: unknown) {
    this.logger.info(message, context);
  }
  error(message: any, context?: unknown) {
    this.logger.error(message, context);
  }
  warn(message: any, context?: unknown) {
    this.logger.warn(message, context);
  }
  debug(message: any, context?: unknown) {
    this.logger.debug(message, context);
  }
  verbose(message: any, context?: string) {
    this.logger.info(message, { context });
  }
}
