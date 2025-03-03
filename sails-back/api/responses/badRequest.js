/**
 * badRequest response
 *
 * @description :: 错误请求
 * @usage       ::
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'badRequest'
 *       }
 *     }
 * ```
 */

const statuses = require('statuses');

module.exports = async function (err, code = 40000, statusCode = 400) {
  const message = typeof err === 'object' ? _.get(err, 'message') : err;
  TracerService.info(this.res, '客户端请求错误', err);

  return this.res.status(statusCode).send({
    ...(sails.config.isProd ? {} : await sails.helpers.request.getRequestInfo(this.res)),
    code,
    message: message ?? statuses(404),
  });
};
