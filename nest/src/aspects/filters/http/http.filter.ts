import {
  ArgumentsHost,

  Catch,

  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Tracer } from 'src/services/tracer/tracer.service'
import { DefaultFilter } from '../default/default.filter'

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  private tracer = new Tracer(DefaultFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Res>()

    const status = exception.getStatus()

    const errorResponse = {
      code: status * 100,
      message: exception.message,
    }

    this.tracer.log(`-ERR[${status}] ${exception.message}`, {
      status,
      code: errorResponse.code,
      cost: res.getCostNs(),
      cid: res.clientId,
    })

    res.status(status)
    res.send(errorResponse)
  }
}
