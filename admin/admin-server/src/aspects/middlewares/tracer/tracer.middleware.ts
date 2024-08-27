import { Injectable, NestMiddleware } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { TracerService } from 'src/services/tracer/tracer.service';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(private readonly tracer: TracerService) {}
  private tracerIdGenerator = customAlphabet('0123456789', 5);

  async use(req: Req, res: Res, next: () => void) {
    const stime = process.hrtime.bigint();
    req.stime = stime;
    const { method, originalUrl } = req;
    const requestTid = res.get('tracer-id');
    const rid = requestTid || `${Date.now()}${this.tracerIdGenerator()}`;
    const userId = req.session.userId;
    const requestTracer = this.tracer.child({
      name: `${rid}${userId ? `#${userId}` : ''}`,
    });
    res.on('finish', function (this: Res) {
      const cost = process.hrtime.bigint() - stime;
      requestTracer.log('Request Finish', {
        cost: cost.toString(),
        status: this.statusCode,
      });
    });
    console.log(req.useragent);

    requestTracer.log(
      `Incoming Info：${userId ?? 'NO_USER'} ${method} ${originalUrl}`,
    );
    // 生产环境不上报
    requestTracer.debug('Incoming Data', {
      body: req.body,
      query: req.query,
    });
    req.tracer = requestTracer;

    res.setHeader('request-id', rid);
    next();
  }
}
