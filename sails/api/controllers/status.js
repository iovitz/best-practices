/**
 * status action
 *
 * @description :: 获取服务器状态
 * @usage       :: 'GET /api/v1/status': { action: 'status' },
 */
module.exports = {

  inputs: {
    // name: {
    //   type: 'string',
    //   example: 'zhangsan',
    //   description: 'Someone\'s name',
    //   required: true,
    //   custom() {
    //     return true
    //   },
    // },
  },

  exits: sails.config.http.responses,

  async fn(input, exits) {
    try {
      // const data = await User.create({
      //   id: '1',
      //   firstName: 'John',
      //   lastName: 'Doe',
      //   email: 'na12412me1@qq.com',
      //   age: 25,
      // }).fetch()
      return exits.ok('da')
    }
    catch (e) {
      return exits.serverError(e.cause)
    }
  },
}
