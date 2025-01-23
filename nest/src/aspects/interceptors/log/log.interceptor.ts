import {
  CallHandler,
  ExecutionContext,

  Injectable,

  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Tracer } from 'src/services/tracer/tracer.service'

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private tracer = new Tracer(LogInterceptor.name)
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest()
    const { method, originalUrl } = req

    this.tracer.log(`+REQ：${method} ${originalUrl}`, {
      tracerId: req.tracerId,
      clientId: req.clientId,
      body: req.body,
      query: req.query,
    })

    return next.handle().pipe(
      map((data) => {
        this.tracer.log('-REQ', {
          tracerId: req.tracerId,
          cost: req.getCostNs(),
        })
        return data
      }),
    )
  }
}
