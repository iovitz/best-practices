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
    const data = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john2222.doe@example.com',
      age: 25,
    }).fetch()

    return exits.ok(data)
  },

}
