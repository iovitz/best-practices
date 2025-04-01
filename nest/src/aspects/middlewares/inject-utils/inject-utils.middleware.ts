import { Injectable, NestMiddleware } from '@nestjs/common'
import { customAlphabet } from 'nanoid'
import { CookieKeys } from 'src/shared/constans/cookie'
import { Tracer } from 'src/shared/tracer/tracer'

@Injectable()
export class InjectUtilsMiddleware implements NestMiddleware {
  private tracer = new Tracer(InjectUtilsMiddleware.name)

  private idGenerator = customAlphabet('ABCDEFGHJKMNPQRTUVWXYabcdefghjkmnpqrtuvwxy346789')

  use(req: Req, res: Res, next: () => void) {
    this.useReqTime(req, res)
    this.useCookie(req, res)
    this.useTracerId(req, res)
    // 获取请求耗时（ns）
    next()
  }

  /**
   * 获取请求耗时
   */
  useReqTime(req: Req, res: Res) {
    req.startNs = res.startNs = process.hrtime.bigint()
  }

  /**
   * 注入Cookie的快捷操作方法
   */
  useCookie(req: Req, res: Res) {
    res.getCookie = req.getCookie = function (key: CookieKeys) {
      return req.cookies[key]
    }

    res.setCookie = req.setCookie = function (key: CookieKeys, value: string) {
      return res.cookie(key, value, {
        signed: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        httpOnly: true,
      })
    }
  }

  /**
   * 使用客户端ID
   */
  useTracerId(req: Req, res: Res) {
    req.clientId = req.getCookie(CookieKeys.ClientId) ?? this.idGenerator(8)
    req.tracerId = res.tracerId = `${req.clientId}-${this.idGenerator(10)}`
    res.cookie(CookieKeys.ClientId, req.clientId, {
      // 可以放到配置中
      signed: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
    })
  }
}
