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

const statuses = require('statuses')

module.exports = async function (err, code = 40000, statusCode = 400) {
  const message = typeof err === 'object' ? _.get(err, 'message') : err
  this.res.logger.error('Bad Request', err)

  return this.res.status(statusCode).send({
    code,
    message: message ?? statuses(400),
  })
}
