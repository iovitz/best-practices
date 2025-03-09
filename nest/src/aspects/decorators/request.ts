import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { CookieKeys } from '../../shared/constans/cookie'
import { SKIP_RESPONSE_FORMAT_KEY } from '../../shared/constans/meta-keys'

// 创建一个自定义装饰器来设置响应元数据
export function SkipFormat() {
  return SetMetadata(SKIP_RESPONSE_FORMAT_KEY, true)
}

// 获取用户IP
export const ClientIP = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>()
    const clientIp = req.header('x-forward-for') ?? req.ip
    if (!clientIp) {
      return '0.0.0.0'
    }
    return clientIp.match(/\d+\.\d+\.\d+\.\d+/)?.[0]
  },
)

// 获取ClientId
export const Cookie = createParamDecorator(
  (cookieKey: CookieKeys, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Req>()
    return req.getCookie(cookieKey)
  },
)
