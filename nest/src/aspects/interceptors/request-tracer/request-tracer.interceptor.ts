import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { customAlphabet } from 'nanoid';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';

@Injectable()
export class RequestTracerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  private tracerIdGenerator = customAlphabet('0123456789', 5);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    // const response = context.switchToHttp().getResponse<Response>();

    const { method, path } = request;

    const tid = `${Date.now()}${this.tracerIdGenerator()}`;
    request.tracer = {
      id: tid,
    };

    const prefix = `${tid} ${method} ${path}`;

    request.logger = {
      debug: (message, context) => {
        this.logger.debug(`${prefix} - ${message}`, context);
      },
      verbose: (message, context) => {
        this.logger.verbose(`${prefix} - ${message}`, context);
      },
      log: (message, context) => {
        this.logger.log(`${prefix} - ${message}`, context);
      },
      warn: (message, context) => {
        this.logger.warn(`${prefix} - ${message}`, context);
      },
      error: (message, context) => {
        this.logger.error(message, '', context);
      },
    };

    request.tracer;
    return next.handle();
  }
}
