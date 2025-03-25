import {
  CallHandler,
  ExecutionContext,

  Injectable,

  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Tracer } from 'src/shared/tracer/tracer'

const tracer = new Tracer('LogInterceptor')
@Injectable()
export class LogInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest()
    const res: Res = context.switchToHttp().getResponse()
    const { method, originalUrl } = req
    const startNs = process.hrtime.bigint()

    tracer.info(`+REQ：${method} ${originalUrl}`, {
      tracerId: req.tracerId,
      clientId: req.clientId,
      body: req.body,
      query: req.query,
    })
    res.on('finish', this.handleResponseFinish)

    res.on('close', this.handleResponseClose)

    return next.handle().pipe(
      map((data) => {
        const cost = `${(process.hrtime.bigint() - startNs).toLocaleString()}ns`
        tracer.info(`-Controller finished`, {
          cost,
          tracerId: req.tracerId,
        })
        return data
      }),
    )
  }

  handleResponseFinish(this: Res) {
    const cost = this.startNs ? `${(process.hrtime.bigint() - this.startNs).toLocaleString()}ns` : '-'
    tracer.info(`-Connection finished With Status Code ${this.statusCode}`, {
      cost,
      tracerId: this.tracerId,
    })
  }

  handleResponseClose(this: Res) {
    const cost = this.startNs ? `${(process.hrtime.bigint() - this.startNs).toLocaleString()}ns` : '-'
    tracer.info(`-Connection Closed With Status Code ${this.statusCode}`, {
      cost,
      tracerId: this.tracerId,
    })
  }
}
