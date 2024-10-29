import type {
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common'
import {
  Catch,
  HttpException,
} from '@nestjs/common'
import * as stringify from 'json-stringify-safe'

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Res>()

    const status = exception.getStatus()

    const errorResponse = {
      code: status * 100,
      message: exception.message,
    }

    res.tracer.log(`-ERR[${status}] ${exception.message}`, {
      status,
      code: errorResponse.code,
      cost: res.getCostNs(),
      cid: res.clientId,
    })

    res.status(status)
    res.send(errorResponse)
  }
}
