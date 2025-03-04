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

const statuses = require('statuses')

module.exports = async function () {
  console.warn(this.req, '请求过多')
  return this.res.status(429).send({
    code: 0,
    message: statuses(429),
  })
}
