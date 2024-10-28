import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const userId = req.session.userId;

    req.tracer.log(`+REQ：${userId ?? '@'} ${method} ${originalUrl}`);
    // 生产环境不上报
    req.tracer.debug('Incoming Data', {
      body: req.body,
      query: req.query,
    });
    const data = await next.handle();

    req.tracer.log('-SUC', {
      cost: req.getCostNs(),
    });

    return data;
  }
}
