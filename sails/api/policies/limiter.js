const { RateLimiter } = require('limiter');

// const logIdReg = //

module.exports = function (req, res, next) {
  const { clientid } = req.headers;
  if (!clientid) {
    return res.badRequest();
  }

  const { limiterTimer } = sails;
  const limiter = sails.limiter.get(clientid) ?? new RateLimiter({
    tokensPerInterval: 5,
    interval: 'minute',
    fireImmediately: true,
  });
  sails.limiter.set(clientid, limiter);

  // 校验LogID
  const enableRequest = limiter.tryRemoveTokens(1);

  if (Math.random() < 0.01) {
    limiterTimer.keys().forEach((clientId) => {
      if (limiterTimer.get(clientId) === 0) {
        console.log('123');
      }
    });
  }

  // 判断是否可以请求
  if (enableRequest) {
    limiter.removeTokens(1);
    return next();
  }

  return res.tooManyRequest();
};
