/**
 * logger hook
 *
 * @description :: 应用日志
 */

module.exports = function defineLimiterHook(sails) {
  // ...
  sails.log.info('启动', '123')
  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    async initialize() {
      sails.log.info('Initializing custom hook (`logger`)')
    },

  }
}
