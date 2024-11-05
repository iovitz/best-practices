import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { CookieKeys } from '../constans/cookie'
import { SKIP_RESPONSE_FORMAT_KEY } from '../constans/meta-keys'

// 创建一个自定义装饰器来设置响应元数据
export function SkipFormat() {
  return SetMetadata(SKIP_RESPONSE_FORMAT_KEY, true)
}

// 拿到请求Tracer
export const Tracer = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>()
    return req.tracer
  },
)

// 获取用户IP
export const ClientIP = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>()
    return req.ip.match(/\d+\.\d+\.\d+\.\d+/)?.[0]
  },
)

// 获取ClientId
export const Cookie = createParamDecorator(
  (cookieKey: CookieKeys, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>()
    return req.getCookie(cookieKey)
  },
)
