import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TracerService } from 'src/services/tracer/tracer.service';
import { SKIP_RESPONSE_FORMAT_KEY } from 'src/shared/constans/meta-keys';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  constructor(private tracer: TracerService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = ctx.getHandler();
    const skipFormat = Reflect.getMetadata(SKIP_RESPONSE_FORMAT_KEY, handler);
    return next.handle().pipe(
      map((data) => {
        // 跳过format
        if (skipFormat) {
          this.tracer.log(`Skip Response Format`);
          return data;
        }
        // this.logger.log(`(${tracerInfo})Request Success`);
        return {
          data,
          code: 0,
          message: 'success',
        };
      }),
    );
  }
}
