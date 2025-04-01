import { join } from 'node:path'
import {
  CallHandler,
  ExecutionContext,

  Inject,

  Injectable,

  NestInterceptor,
} from '@nestjs/common'
import { PATH_METADATA } from '@nestjs/common/constants'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'
import { Tracer } from 'src/shared/tracer/tracer'
// import {  } from '@nestjs/common/constants'

const tracer = new Tracer('LogInterceptor')
@Injectable()
export class LogInterceptor implements NestInterceptor {
  @Inject(Reflector)
  reflector: Reflector

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest()
    const res: Res = context.switchToHttp().getResponse()
    const { method } = req
    const startNs = process.hrtime.bigint()
    const path = join(
      this.reflector.get(PATH_METADATA, context.getClass()),
      this.reflector.get(PATH_METADATA, context.getHandler()),
    )

    tracer.info(`+REQ：[${method} ${path}]`, {
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
    tracer.debug(`-Connection finished With Status Code ${this.statusCode}`, {
      cost,
      tracerId: this.tracerId,
    })
  }

  handleResponseClose(this: Res) {
    const cost = this.startNs ? `${(process.hrtime.bigint() - this.startNs).toLocaleString()}ns` : '-'
    tracer.debug(`-Connection Closed With Status Code ${this.statusCode}`, {
      cost,
      tracerId: this.tracerId,
    })
  }
}
