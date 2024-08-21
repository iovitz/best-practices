import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_LOGGER } from '../constans/meta-keys';

export const Log = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const handler = ctx.getHandler();

    return Reflect.getMetadata(REQUEST_LOGGER, handler);
  },
);
