import {
  CallHandler,
  ExecutionContext,

  Injectable,

  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Tracer } from 'src/shared/tracer/tracer'

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private tracer = new Tracer(LogInterceptor.name)
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest()
    const { method, originalUrl } = req
    const startNs = process.hrtime.bigint()

    this.tracer.info(`+REQ：${method} ${originalUrl}`, {
      tracerId: req.tracerId,
      clientId: req.clientId,
      body: req.body,
      query: req.query,
    })

    return next.handle().pipe(
      map((data) => {
        const cost = process.hrtime.bigint() - startNs
        this.tracer.info('-REQ', {
          tracerId: req.tracerId,
          cost,
        })
        return data
      }),
    )
  }
}
