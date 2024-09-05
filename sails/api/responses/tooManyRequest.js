/**
 * tooManyRequest response
 *
 * @description :: 请求过多触发限流
 * @usage       ::
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'tooManyRequest'
 *       }
 *     }
 * ```
 */

const statuses = require('statuses');

module.exports = async function () {
  TracerService.warn(this.req, '请求过多');
  return this.res.status(429).send({
    ...(sails.config.isProd ? {} : await sails.helpers.request.getRequestInfo(this.res)),
    code: 0,
    message: statuses(429),
  });
};
