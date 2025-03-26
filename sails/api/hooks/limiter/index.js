/**
 * limiter hook
 *
 * @description :: 限流
 */
const { RateLimiter } = require('limiter')
const { LRUCache } = require('lru-cache')

const logger = rootLogger.child({
  scope: 'Hook-limiter',
})

class LimiterManager {
  constructor(config) {
    this.config = config
    // 创建缓存实例
    this.limiterMap = new LRUCache({
      max: config.lruMax, // 最大缓存项数
      maxAge: config.lruMaxAge, // 每个缓存项最多存活1分钟
      dispose: (key) => {
        logger.error(`Disposed: ${key}`)
      },
    })
  }

  check(key) {
    const limiter = this.limiterMap.get(key) ?? new RateLimiter({
      tokensPerInterval: this.config.limiterTokens,
      interval: this.config.limiterInterval,
      fireImmediately: true,
    })
    this.limiterMap.set(key, limiter)

    if (!limiter.tryRemoveTokens(1)) {
      return false
    }

    return true
  }
}

module.exports = function defineLimiterHook(sails) {
  const startTime = process.hrtime.bigint()
  // ...
  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    async initialize() {
      const { limiter: limiterConfig } = sails.config.custom
      sails.limiter = new LimiterManager({
        lruMax: limiterConfig.lruMax,
        lruMaxAge: limiterConfig.lruMaxAge,
        limiterTokens: limiterConfig.limiterTokens,
        limiterInterval: limiterConfig.limiterInterval,
      })
      const cost = Number(process.hrtime.bigint() - startTime).toLocaleString()
      logger.bootstrap(`Initializing custom hook (\`limiter\`), cost: ${cost}`)
    },

  }
}
