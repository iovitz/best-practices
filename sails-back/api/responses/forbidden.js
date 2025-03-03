/**
 * forbidden response
 *
 * @description :: 无权限访问资源
 * @usage       ::
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'forbidden'
 *       }
 *     }
 * ```
 */

const statuses = require('statuses');

module.exports = async function (err) {
  const code = _.get(err, 'code');
  const message = _.get(err, 'message');
  TracerService.info(this.res, '请求无权限', err);

  return this.res.status(403).send({
    ...(sails.config.isProd ? {} : await sails.helpers.request.getRequestInfo(this.res)),
    code: code || 40003,
    message: message || statuses(403),
  });
};
