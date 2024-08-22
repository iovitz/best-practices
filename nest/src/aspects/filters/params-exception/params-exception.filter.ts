import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TracerService } from 'src/services/tracer/tracer.service';
import { ParamsException } from 'src/shared/errors/errors';
import * as statuses from 'statuses';

@Catch(ParamsException)
export class ParamsExceptionFilter implements ExceptionFilter {
  constructor(
    private tracer: TracerService,
    private config: ConfigService,
  ) {}

  catch(exception: ParamsException, host: ArgumentsHost) {
    this.tracer.error(exception.message, exception);
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
