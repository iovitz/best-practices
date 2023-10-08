"use strict";

const Controller = require("../core/controller");

class TestController extends Controller {
  async testGet() {
    const { ctx } = this;
    const { query } = ctx;
    const res = await ctx.validate("schema.user.testDto", query);
    if (!res) {
      return this.ctx.paramsError();
    }
    ctx.app.testApp();
    ctx.helper.testHelper();
    ctx.service.user.testUserService();
    return this.ctx.success(query);
  }

  async testPost() {
    const { ctx } = this;
    const { body } = ctx;
    const res = await ctx.validate("schema.user.testDto", body);
    if (!res) {
      return this.ctx.paramsError();
    }
    return this.ctx.success(body);
  }
}

module.exports = TestController;
