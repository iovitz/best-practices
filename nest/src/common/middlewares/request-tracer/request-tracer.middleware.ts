import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { Observable } from 'rxjs';
import { LogService } from 'src/services/log/log.service';

@Injectable()
export class RequestTracerInterceptor implements NestInterceptor {
  constructor(private log: LogService) {}

  private tracerIdGenerator = customAlphabet('0123456789', 5);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const http = ctx.switchToHttp();
    const req = http.getRequest<Req>();
    const res = http.getResponse<Res>();
    const { method, path } = req;
    const requestTid = res.get('tracer-id');
    const rid = requestTid || `${Date.now()}${this.tracerIdGenerator()}`;
    const userId = 'u123123';
    const requestLogger = this.log.child({
      traceInfo: `${rid}${userId ? `#${userId}` : ''}`,
    });

    requestLogger.log(`reqMeta：${userId} ${method} ${path}`);
    // 生产环境不上报
    requestLogger.log('reqData', {
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.logger = requestLogger;

    res.setHeader('request-id', rid);

    return next.handle();
  }
}
