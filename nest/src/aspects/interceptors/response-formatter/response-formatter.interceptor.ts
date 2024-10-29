import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { TracerService } from 'src/services/tracer/tracer.service'
import {
  Injectable,
} from '@nestjs/common'
import { map } from 'rxjs/operators'
import { SKIP_RESPONSE_FORMAT_KEY } from 'src/shared/constans/meta-keys'

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  constructor() {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = ctx.getHandler()
    const req = ctx.switchToHttp().getRequest()
    const skipFormat = Reflect.getMetadata(SKIP_RESPONSE_FORMAT_KEY, handler)
    return next.handle().pipe(
      map((data) => {
        // 跳过format
        if (skipFormat) {
          req.tracer.log(`Skip Response Format`)
          return data
        }
        return {
          data,
          code: 0,
          message: 'success',
        }
      }),
    )
  }
}
