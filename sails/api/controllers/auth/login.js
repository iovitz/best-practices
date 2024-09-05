/**
 * login action
 *
 * @description :: 用户登录
 * @usage       :: 'POST /api/v1/auth/login': { action: 'auth/login' },
 */

module.exports = {

  inputs: {
    nickname: {
      type: 'string',
      example: 'zhangsan',
      description: 'nickname',
      required: true,
      async custom(v) {
        return ValidateService.nickname(v);
      },
    },
    email: {
      type: 'string',
      example: 'my@qq.com',
      description: 'Email',
      required: true,
      async custom(v) {
        return ValidateService.email(v);
      },
    },
    password: {
      type: 'string',
      example: '123123',
      description: '字母开头的六到16位密码',
      required: true,
      custom(v) {
        return ValidateService.password(v);
      },
    },
    code: {
      type: 'string',
      example: 'aaaa',
      description: '验证码',
      required: true,
      custom(v) {
        return ValidateService.verifyCode(v);
      },
    },
    register: {
      type: 'boolean',
      example: true,
      description: '注册并登录',
      require: false,
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
    // 校验验证码
    // const isVerifyCodeRight = VerifyService.checkVerifyCode(this.req.session, 'login', input.code);

    // if (!isVerifyCodeRight) {
    //   return exits.badRequest('验证码错误');
    // }

    let existsUser = await AuthService.findUserByEmail(input.email);

    if (input.register) {
      // 注册用户
      if (existsUser) {
        return exits.badRequest('邮箱已被注册');
      }
      existsUser = await AuthService.createUser({
        ...input,
      });
    } else {
      // 登录
      if (!existsUser || !EncryptService.comparePassword(input.password, existsUser.password)) {
        return exits.badRequest('账号或密码错误');
      }
    }

    const [userProfile, sessionId] = await Promise.all([
      UserService.findUserProfileById(existsUser.id),
      AuthService.createSession(existsUser.id),
    ]);

    return exits.ok({
      ...UserService.getUserProfileInfo(userProfile),
      session: sessionId,
    });
  },

};
