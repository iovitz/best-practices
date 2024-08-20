import { Request, Response } from 'express';

export {};

declare global {
  interface Req extends Request {
    user?: any;
    userId?: string;

    tid?: string;
    traceInfo?: string;
  }
  interface Res extends Response {}

  // 往原始类型上增加类型
  namespace Express {
    export interface Request {}
    export interface Response {}
  }
}
