import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Log = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Req>();

    return data ? request.body[data] : request.body;
  },
);
