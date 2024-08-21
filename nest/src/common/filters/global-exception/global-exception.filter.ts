import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();
    const res = httpCtx.getResponse<Res>();
    const req = httpCtx.getRequest<Req>();
    req.logger.error('global error', exception);

    const errorResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorResponse);
  }
}
