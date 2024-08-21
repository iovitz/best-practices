import { Request, Response } from 'express';
import type { LogService } from './services/log/log.service';

export {};

declare global {
  interface Req extends Request {
    user?: any;
    userId?: string;

    logger?: LogService;
  }
  interface Res extends Response {
    // ...
  }

  // 往原始类型上增加类型
  namespace Express {
    export interface Request {}
    export interface Response {}
  }
}
