import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request } from 'express';
import { customAlphabet } from 'nanoid';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {}

  private tracerIdGenerator = customAlphabet('0123456789', 5);

  use = (req: Request, res: Response, next: () => void) => {
    req.tracer = {
      id: `${Date.now()}${this.tracerIdGenerator()}`,
    };
    req.logger = {
      debug: (message, context) => {
        this.logger.debug(message, context);
      },
      verbose: (message, context) => {
        this.logger.verbose(message, context);
      },
      log: (message, context) => {
        this.logger.log(message, context);
      },
      warn: (message, context) => {
        this.logger.warn(message, context);
      },
      error: (message, context) => {
        this.logger.error(message, context);
      },
      fatal: (message, context) => {
        console.log(message, context);
        this.logger.fatal(message, context);
      },
    };
    this.logger.verbose({
      name: 'zs',
    });
    next();
  };
}
