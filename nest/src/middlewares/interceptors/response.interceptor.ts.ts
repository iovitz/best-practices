import {
  CallHandler,
  ExecutionContext,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res: Res = context.getArgByIndex(1);
        // 跳过format
        if (res.skipFormat) {
          this.logger.log('Skip Response Format');
          return data;
        }
        return {
          data,
          code: 0,
          message: 'success',
        };
      }),
    );
  }
}
