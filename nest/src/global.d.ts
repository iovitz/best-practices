import { Request, Response } from 'express';
import { TracerService } from './services/tracer/tracer.service';
import { PromiseManager } from './aspects/middlewares/promise-manager/promise-manager.middleware';

export {};

declare global {
  interface Req extends Request {
    user?: any;
    userId?: string;

    stime?: bigint;
    tracer?: TracerService;
    promiseManager?: PromiseManager;
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

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
