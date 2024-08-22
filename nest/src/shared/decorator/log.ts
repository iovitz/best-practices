import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Log = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>();
    return req.logger;
  },
);
