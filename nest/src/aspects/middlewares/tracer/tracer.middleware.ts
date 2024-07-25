import { Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { customAlphabet } from 'nanoid';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}

  private tracerIdGenerator = customAlphabet('0123456789', 5);

  use = (req: Request, res: Response, next: () => void) => {
    req.tracer = {
      id: `${Date.now()}${this.tracerIdGenerator()}`,
    };
    this.logger.verbose({
      name: 'zs',
    });
    next();
  };
}
