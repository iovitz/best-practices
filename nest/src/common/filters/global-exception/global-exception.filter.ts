import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST_LOGGER } from 'src/common/constans/meta-keys';
import { LogService } from 'src/services/log/log.service';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();
    const res = httpCtx.getResponse<Res>();
    const handler = res.handler;
    const logger: LogService = Reflect.getMetadata(REQUEST_LOGGER, handler);
    logger.error('global error', exception);

    const errorResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorResponse);
  }
}
