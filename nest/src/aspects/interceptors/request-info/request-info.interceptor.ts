import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInfoInterceptor implements NestInterceptor {
  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Req = ctx.switchToHttp().getRequest();
    const stime = process.hrtime.bigint();
    req.stime = stime;
    const { method, originalUrl } = req;
    const userId = req.session.userId;

    req.tracer.log(
      `Incoming Info：${userId ?? 'NO_USER'} ${method} ${originalUrl}`,
    );
    // 生产环境不上报
    req.tracer.debug('Incoming Data', {
      body: req.body,
      query: req.query,
    });
    const data = await next.handle();

    const cost = process.hrtime.bigint() - stime;
    req.tracer.log('Request Finish', {
      cost: cost.toString(),
    });
    return data;
  }
}
