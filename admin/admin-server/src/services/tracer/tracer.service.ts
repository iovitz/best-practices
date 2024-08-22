import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';
import * as l4j from 'log4js';

const ERROR = Symbol('ERROR');
const tokens = {
  name: function (logEvent) {
    const info = logEvent.context.name;
    return info ? ` ${info}` : '';
  },
};

l4j.configure({
  appenders: {
    stdout: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%p%x{name} %m',
        tokens,
      },
    },
    all: {
      type: 'file',
      filename: 'logs/app',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true, // 设置文件名称为 filename + pattern
      level: 'info',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %z %p%x{name} %m',
        tokens,
      },
      maxLogSize: '10m',
    },
  },
  categories: {
    default: { appenders: ['stdout', 'all'], level: 'debug' },
  },
});
interface LogInfo {
  name?: string;
  pid?: number;
  traceInfo?: string;
  msgPrefix?: string;
  stack?: string;

  payload?: string;
  [key: string | symbol]: unknown;
}
type LogContext = string | Error | LogInfo;
type Logger = l4j.Logger;

class BaseTracer implements LoggerService {
  logger: Logger;
  constructor(logger?: Logger) {
    this.logger = logger ?? this.createRootLogger();
  }

  createRootLogger() {
    return l4j.getLogger('APP');
  }

  private formatContext(context?: LogContext | string) {
    if (!context) return {};
    if (context instanceof Error) {
      return {
        [ERROR]: true,
        name: context.message ?? get(context, 'message'),
        message: context.message ?? get(context, 'message'),
        stack: context.stack?.split('\n').join('\\n'),
      };
    }
    if (typeof context === 'object') {
      return context;
    }
    return {
      payload: context,
    };
  }

  log(message: any, context?: LogContext) {
    this.logger.info(message, context);
  }
  error(message: any, context?: LogContext) {
    this.logger.error(message, context);
  }
  warn(message: any, context?: LogContext) {
    this.logger.warn(message, context);
  }
  debug(message: any, context?: LogContext) {
    this.logger.debug(message, context);
  }
  verbose(message: any, context?: string) {
    this.logger.info(message, context);
  }

  child(context: Record<string, string>) {
    const logger = l4j.getLogger();
    for (const k in context) {
      logger.addContext(k, context[k]);
    }
    return new BaseTracer(logger) as TracerService;
  }
}

@Injectable()
export class TracerService extends BaseTracer {
  constructor(private config: ConfigService) {
    super();
  }
}
