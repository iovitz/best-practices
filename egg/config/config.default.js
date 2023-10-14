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
  config.swaggerdoc = {
    dirScanner: "./app/controller",
    basePath: "/api",
    apiInfo: {
      title: "egg-swagger",
      description: "swagger-ui for egg",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    enableSecurity: false,
    // enableValidate: true,
    routerMap: true,
    enable: true,
  };
  return {
    ...config,
  };
};
