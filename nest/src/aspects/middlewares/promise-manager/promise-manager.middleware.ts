import { Injectable, NestMiddleware } from '@nestjs/common';

export class PromiseManager {
  private promiseMap = new Map<string, Promise<any>>();

  add(key: string, promise: Promise<any>) {
    this.promiseMap.set(key, promise);
  }

  get(key: string) {
    return this.promiseMap.get(key);
  }
}

@Injectable()
export class PromiseManagerMiddleware implements NestMiddleware {
  async use(req: Req, res: Res, next: () => void) {
    req.promiseManager = new PromiseManager();
    next();
  }
}
