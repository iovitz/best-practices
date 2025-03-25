import {
  ArgumentsHost,

  Catch,

  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Tracer } from 'src/shared/tracer/tracer'

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  private tracer = new Tracer(HttpFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Res>()

    const status = exception.getStatus()

    const errorResponse = {
      code: status * 100,
      message: exception.message,
    }

    this.tracer.info(`-ERR[${status}] ${exception.message}`, {
      status,
      code: errorResponse.code,
      cid: res.clientId,
    })

    res.status(status)
    res.send(errorResponse)
  }
}
