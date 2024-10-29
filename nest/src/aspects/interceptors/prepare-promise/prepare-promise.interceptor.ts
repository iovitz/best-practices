import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import {
  Injectable,
} from '@nestjs/common'

@Injectable()
export class PreparePromiseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // PreparePromise
    // const req = context.switchToHttp().getRequest<Req>();
    // req.promiseManager;
    return next.handle()
  }
}
