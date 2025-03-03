/**
 * ok response
 *
 * @description :: 请求成功
 * @usage       ::
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'ok'
 *       }
 *     }
 * ```
 */

module.exports = function (optionalData, status = 200) {
  TracerService.info(this.req, '请求完成');
  return this.res.status(status).send({
    code: 0,
    data: optionalData,
    message: 'success',
  });
};
