/**
 * check-register action
 *
 * @description :: 检查Email是否已经注册过了
 * @usage       :: 'POST /api/v1/auth/check-register': { action: 'auth/check-register' },
 */

module.exports = {

  inputs: {
    email: {
      type: 'string',
      example: 'someone@gmail.com',
      description: 'Someone\'s email',
      required: true,
      async custom(v) {
        return ValidateService.email(v);
      },
    },
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
    const exitsUser = await AuthService.findUserByEmail(input.email);
    return exits.ok(!!exitsUser);
  },

};
