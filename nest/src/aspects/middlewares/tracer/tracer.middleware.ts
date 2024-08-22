import { Injectable, NestMiddleware } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { LogService } from 'src/services/log/log.service';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(private readonly log: LogService) {}
  private tracerIdGenerator = customAlphabet('0123456789', 5);

  async use(req: Req, res: Res, next: () => void) {
    const stime = process.hrtime.bigint();
    req.stime = stime;
    const { method, originalUrl } = req;
    const requestTid = res.get('tracer-id');
    const rid = requestTid || `${Date.now()}${this.tracerIdGenerator()}`;
    const userId = req.session.userId;
    const requestLogger = this.log.child({
      traceInfo: `${rid}${userId ? `#${userId}` : ''}`,
    });
    res.on('finish', function (this: Res) {
      const cost = process.hrtime.bigint() - stime;
      requestLogger.log('REQUEST FINISH', {
        cost: cost.toString(),
        status: this.statusCode,
      });
    });

    requestLogger.log(
      `Incoming Info：${userId ?? 'NO_USER'} ${method} ${originalUrl}`,
    );
    // 生产环境不上报
    requestLogger.debug('Incoming Data', {
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.logger = requestLogger;

    res.setHeader('request-id', rid);
    next();
  }
}
