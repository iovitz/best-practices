import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
@Catch(Error)
export class InternalExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();
    const res = httpCtx.getResponse<Res>();
    const req = httpCtx.getRequest<Req>();
    req.logger.error('Internal Error', exception);
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = {
      code: status,
      message: 'Internal Server Error',
    };
    res.status(status);
    res.send(errorResponse);
  }
}
