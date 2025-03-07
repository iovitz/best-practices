/**
 * tooManyRequest response
 *
 * @description :: 请求过多触发限流
 */

const statuses = require('statuses')

module.exports = async function (err) {
  const code = _.get(err, 'code')
  const message = _.get(err, 'message')
  console.error(this.res, '服务端内部错误', err)

  return this.res.status(422).send({
    code: code ?? 0,
    message: message ?? statuses(422),
  })
}
