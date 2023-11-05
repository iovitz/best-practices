const path = require("path");

module.exports = (appInfo) => {
  const config = (exports = {});

  config.middleware = ["auth", "errorHandler"];

  // 需要进行jwt鉴权的路由前缀
  config.needAuthPrefixList = [];

  config.static = {
    prefix: "/",
    dir: path.join(appInfo.baseDir, "app/public"),
    dynamic: true,
    preload: false,
    maxAge: 31536000,
    buffer: true,
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cluster = {
    listen: {
      port: 4321,
    },
  };

  config.io = {
    namespace: {
      "/": {
        connectionMiddleware: ["auth"],
        packetMiddleware: ["filter"],
      },
    },
  };
  return {
    ...config,
  };
};
