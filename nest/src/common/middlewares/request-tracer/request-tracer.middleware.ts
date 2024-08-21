import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { Observable } from 'rxjs';
import { REQUEST_LOGGER } from 'src/common/constans/meta-keys';
import { LogService } from 'src/services/log/log.service';

@Injectable()
export class RequestTracerInterceptor implements NestInterceptor {
  constructor(private log: LogService) {}

  private tracerIdGenerator = customAlphabet('0123456789', 5);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const http = ctx.switchToHttp();
    const req = http.getRequest<Req>();
    const res = http.getResponse<Res>();
    const handler = ctx.getHandler();
    const { method, path } = req;
    const requestTid = res.get('tracer-id');
    const tid = requestTid || `${Date.now()}${this.tracerIdGenerator()}`;
    const requestLogger = this.log.child({
      pid: tid,
    });
    const userId = 'u123123';

    requestLogger.log(`META：${userId} ${method} ${path}`);

    Reflect.defineMetadata(REQUEST_LOGGER, requestLogger, handler);

    req.tid = tid;
    req.traceInfo = `${tid} ${method} ${path}`;
    res.setHeader('tracer-id', tid);

    return next.handle();
  }
}
