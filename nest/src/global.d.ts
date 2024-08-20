import { LoggerService } from '@nestjs/common';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      userId?: string;

      tracer?: {
        id: string;
      };

      /**
       * 外部注入
       */
      logger: LoggerService;
    }
    export interface Response {
      skipFormat?: boolean;
    }
  }
}
