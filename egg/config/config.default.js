const path = require("path");

module.exports = (appInfo) => {
  const config = (exports = {});

  config.middleware = ["errorHandler"];

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

  config.ajv = {
    keyword: "schema",
    allErrors: true,
    jsonPointers: true,
  };

  config.cluster = {
    listen: {
      port: 6636,
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
