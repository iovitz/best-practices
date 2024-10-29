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
export class LogInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest()
    const { method, originalUrl } = req

    req.tracer.log(`+REQ：${method} ${originalUrl}`, {
      clientId: req.clientId,
      userId: req.session.userId,
      body: req.body,
      query: req.query,
    })

    const data = await next.handle()

    req.tracer.log('-SUC', {
      cost: req.getCostNs(),
      clientId: req.clientId,
      userId: req.session.userId,
    })

    return data
  }
}
