import type { Request, Response } from 'express';

declare global {
  type Res = Response & {
    /**
     * 跳过响应体格式化
     */
    skipFormat?: boolean;
  };
  type Req = Request;
}
