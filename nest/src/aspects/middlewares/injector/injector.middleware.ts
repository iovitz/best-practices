import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { TracerService } from 'src/services/tracer/tracer.service';
import { CookieKeys } from 'src/shared/constans/cookie';
import { PromiseManager } from 'src/shared/utils/promise-manager';

@Injectable()
export class InjectorMiddleware implements NestMiddleware {
  @Inject(TracerService)
  private readonly tracer: TracerService;

  constructor() {}

  use(req: Req, res: Res, next: () => void) {
    this.useCost(req, res);
    this.useCookie(req, res);
    this.useTracer(req, res);
    this.useClientId(req, res);
    this.usePromiseManager(req, res);
    // 获取请求耗时（ns）
    next();
  }

  /**
   * 获取请求耗时
   */
  useCost(req: Req, res: Res) {
    const startNs = process.hrtime.bigint();
    res.getCostNs = req.getCostNs = function () {
      return Number(process.hrtime.bigint() - startNs).toLocaleString();
    };
  }

  private idGenerator = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    10,
  );

  /**
   * 注入Cookie的快捷操作方法
   */
  useCookie(req: Req, res: Res) {
    res.getCookie = req.getCookie = function (key: CookieKeys) {
      return req.cookies[key];
    };

    res.setCookie = req.setCookie = function (key: CookieKeys, value: string) {
      return res.cookie(key, value, {
        signed: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        httpOnly: true,
      });
    };
  }

  /**
   * 使用客户端ID
   */
  useClientId(req: Req, res: Res) {
    req.clientId = req.getCookie(CookieKeys.ClientId) ?? this.idGenerator();
    res.cookie(CookieKeys.ClientId, req.clientId, {
      // 可以放到配置中
      signed: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
    });
  }

  /**
   * 使用Tracer
   */
  useTracer(req: Req, res: Res) {
    const rid = req.headers['x-trace-id'] ?? this.idGenerator();
    const requestTracer = this.tracer.child(`${rid}`);

    // 请求对象和响应对象上都挂上Tracer
    res.tracer = req.tracer = requestTracer;

    res.setHeader('x-trace-id', rid);
  }

  /**
   * 使用PromiseManager管理异步请求
   */
  usePromiseManager(req: Req, res: Res) {
    res.promiseManager = req.promiseManager = new PromiseManager();
  }
}