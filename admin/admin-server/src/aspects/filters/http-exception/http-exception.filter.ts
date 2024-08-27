import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TracerService } from 'src/services/tracer/tracer.service';
import * as statuses from 'statuses';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private tracer: TracerService,
    private config: ConfigService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Res>();
    const req = ctx.getRequest<Req>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status < 500) {
      req.tracer.log(`Client Error(${status}): `, exception.message);
    } else {
      req.tracer.warn(`Server Error(${status})：`, exception);
    }

    // 不把详细的错误码吐给前端
    const message = statuses(status);

    const errorResponse = {
      code: status * 100,
      message: message,
    };

    // 设置返回的状态码、请求头、发送错误信息
    res.status(status);
    res.send(errorResponse);
  }
}
