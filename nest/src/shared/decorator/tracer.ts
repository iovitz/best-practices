import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export const Tracer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>()
    return req.tracer
  },
)
