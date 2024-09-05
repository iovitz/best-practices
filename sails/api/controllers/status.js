/**
 * status action
 *
 * @description :: 获取服务运行状态
 * @usage       :: 'GET /api/v1/status': { action: 'status' },
 */

module.exports = {

  inputs: {
  },

  exits: {
    ok: {
      responseType: 'ok',
    },
    badRequest: {
      responseType: 'badRequest',
    },
  },

  async fn(input, exits) {
    return exits.badRequest(123);
  },

};
