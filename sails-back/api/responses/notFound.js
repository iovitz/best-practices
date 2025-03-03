/**
 * notFound response
 *
 * @description :: 资源不存在
 * @usage       ::
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'notFound'
 *       }
 *     }
 * ```
 */

const statuses = require('statuses');

module.exports = async function (err) {
  const code = _.get(err, 'code');
  const message = _.get(err, 'message');
  TracerService.info(this.res, '请求404', err);

  return this.res.status(404).send({
    ...(sails.config.isProd ? {} : await sails.helpers.request.getRequestInfo(this.res)),
    code: code || 40004,
    message: message || statuses(404),
  });
};
