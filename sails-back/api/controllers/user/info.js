/**
 * info action
 *
 * @description :: 获取用户信息
 * @usage       :: 'POST /api/v1/user/info': { action: 'user/info' },
 */

module.exports = {
  inputs: {
    // name: {
    //   type: 'string',
    //   example: 'zhangsan',
    //   description: 'Someone\'s name',
    //   required: true,
    //   custom() {
    //     return true;
    //   },
    // },
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
    const data = 'success';

    return exits.ok(data);
  },
};
