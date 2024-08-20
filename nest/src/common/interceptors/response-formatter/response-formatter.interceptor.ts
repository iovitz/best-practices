import {
  CallHandler,
  ExecutionContext,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_RESPONSE_FORMAT_KEY } from 'src/common/constans/meta-keys';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = ctx.getHandler();
    const skipFormat = Reflect.getMetadata(SKIP_RESPONSE_FORMAT_KEY, handler);
    const request = ctx.switchToHttp().getRequest<Req>();
    const tracerInfo = request.traceInfo;
    return next.handle().pipe(
      map((data) => {
        // 跳过format
        if (skipFormat) {
          this.logger.log(`(${tracerInfo})Skip Response Format`);
          return data;
        }
        this.logger.log(`(${tracerInfo})Request Success`);
        return {
          data,
          code: 0,
          message: 'success',
        };
      }),
    );
  }
}
