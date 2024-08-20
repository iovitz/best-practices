import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(
      exception.message,
      exception.stack,
      'AllErrorExceptionFilter',
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Res>();
    const errorResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    response.send(errorResponse);
  }
}
