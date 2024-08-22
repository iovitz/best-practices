import { Injectable, NestMiddleware } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { LogService } from 'src/services/log/log.service';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(private readonly log: LogService) {}
  private tracerIdGenerator = customAlphabet('0123456789', 5);

  use(req: Req, res: Res, next: () => void) {
    const { method, path } = req;
    const requestTid = res.get('tracer-id');
    const rid = requestTid || `${Date.now()}${this.tracerIdGenerator()}`;
    const userId = 'u123123';
    const requestLogger = this.log.child({
      traceInfo: `${rid}${userId ? `#${userId}` : ''}`,
    });

    requestLogger.log(`reqMeta11：${userId} ${method} ${path}`);
    // 生产环境不上报
    requestLogger.log('reqData', {
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.logger = requestLogger;

    res.setHeader('request-id', rid);
    next();
  }
}
