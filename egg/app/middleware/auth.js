const { parse } = require("node:url");

module.exports = (options, app) => {
  return async function (ctx, next) {
    // 拿到需要验证的token的路由
    const needAuthPrefixList = app.config.needAuthPrefixList ?? [];
    // 获取当前路由
    const needAuth = needAuthPrefixList.some((prefix) =>
      ctx.url.startsWith(prefix),
    );
    if (!needAuth) {
      await next();
    } else {
      // 获取token,如果没有传入token，则为空
      let token = ctx.headers.authorization ? ctx.headers.authorization : "";
      token = token.substring(7);

      // 解析token
      try {
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        ctx.state.userinfo = decode;
      } catch (e) {
        throw {
          statusCode: 401,
          code: 40001,
          message: "Unauthorized",
        };
      }
      await next();
    }
  };
};
