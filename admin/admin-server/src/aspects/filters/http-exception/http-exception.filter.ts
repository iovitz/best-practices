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
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.tracer.debug(`HttpExceptionFilter${status}`, exception.message);

    const message = this.config.getOrThrow('isOnline')
      ? statuses(status)
      : exception.message;

    const errorResponse = {
      code: status * 100,
      message: message,
    };

    // 设置返回的状态码、请求头、发送错误信息
    res.status(status);
    res.send(errorResponse);
  }
}
