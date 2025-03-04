import process from 'node:process'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { customAlphabet } from 'nanoid'
import { Tracer } from 'src/services/tracer/tracer.service'
import { CookieKeys } from 'src/shared/constans/cookie'

@Injectable()
export class InjectUtilsMiddleware implements NestMiddleware {
  private tracer = new Tracer(InjectUtilsMiddleware.name)

  use(req: Req, res: Res, next: () => void) {
    this.useCost(req, res)
    this.useCookie(req, res)
    this.useTracerId(req, res)
    // 获取请求耗时（ns）
    next()
  }

  /**
   * 获取请求耗时
   */
  useCost(req: Req, res: Res) {
    const startNs = process.hrtime.bigint()
    res.on('finish', () => {
      const cost = process.hrtime.bigint() - startNs
      this.tracer.log(`Connection finished With Status Code ${res.statusCode}`, {
        cost: cost.toString(),
        tracerId: req.tracerId,
      })
    })

    res.on('close', () => {
      const cost = process.hrtime.bigint() - startNs
      this.tracer.log(`Connection Closed With Status Code ${res.statusCode}`, { cost: cost.toString(), tracerId: req.tracerId })
    })
  }

  private idGenerator = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    10,
  )

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
    req.clientId = req.getCookie(CookieKeys.ClientId) ?? this.idGenerator()
    req.tracerId = res.tracerId = `${req.clientId}-${this.idGenerator()}`
    res.cookie(CookieKeys.ClientId, req.clientId, {
      // 可以放到配置中
      signed: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
    })
  }
}
