/**
 * get-paging helper
 *
 * @description :: 从Query参数中获取分页配置
 * @usage       :: await sails.helpers.request.getPaging.with({})
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
    const data = 'get-paging';

    return exits.success(data);
  },

};
