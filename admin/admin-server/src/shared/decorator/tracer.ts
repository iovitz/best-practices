import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tracer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>();
    return req.tracer;
  },
);
