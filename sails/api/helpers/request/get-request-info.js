/**
 * get-request-info helper
 *
 * @description :: 获取请求信息
 * @usage       :: await sails.helpers.request.requestInfo.with({})
 */

module.exports = {

  inputs: {
    req: {
      type: 'ref',
      example: {},
      description: 'request object',
      required: true,
    },
  },

  async fn({ req }, exits) {
    return exits.success({
      url: req.url,
      method: req.method,
      body: req.body ?? {},
      query: req.query ?? {},
      params: req.params ?? {},
      logId: req.tracer?.id ?? null,
    });
  },

};
