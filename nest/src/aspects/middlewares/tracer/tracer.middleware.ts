import { Injectable, NestMiddleware } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { TracerService } from 'src/services/tracer/tracer.service';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(private readonly tracer: TracerService) {}
  private tracerIdGenerator = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    10,
  );

  async use(req: Req, res: Res, next: () => void) {
    const requestTid = res.get('tracer-id');
    const rid = requestTid || this.tracerIdGenerator();
    const requestTracer = this.tracer.child(`TRACE ${rid}`);

    req.tracer = requestTracer;

    res.setHeader('request-id', rid);
    next();
  }
}
