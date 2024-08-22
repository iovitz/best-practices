import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParamsException } from 'src/common/errors/errors';
import { LogService } from 'src/services/log/log.service';
import * as statuses from 'statuses';

@Catch(ParamsException)
export class ParamsExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: LogService,
    private config: ConfigService,
  ) {}

  catch(exception: ParamsException, host: ArgumentsHost) {
    this.logger.error(exception.message, exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Res>();
    const errorResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.config.get('isOnline')
        ? statuses(HttpStatus.INTERNAL_SERVER_ERROR)
        : exception.errorList,
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    response.send(errorResponse);
  }
}
