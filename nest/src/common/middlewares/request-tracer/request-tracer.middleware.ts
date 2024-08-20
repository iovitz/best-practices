import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';

@Injectable()
export class RequestTracerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  private tracerIdGenerator = customAlphabet('0123456789', 5);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const http = ctx.switchToHttp();
    const request = http.getRequest<Req>();
    const response = http.getResponse<Res>();

    const { method, path } = request;
    const requestTid = request.get('tracer-id');
    const tid = requestTid || `${Date.now()}${this.tracerIdGenerator()}`;
    request.tid = tid;
    request.traceInfo = `${tid} ${method} ${path}`;
    response.setHeader('tracer-id', tid);

    return next.handle();
  }
}
