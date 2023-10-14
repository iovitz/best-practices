"use strict";

const Controller = require("../core/controller");

/**
 * @controller HomeController 根目录接口
 */
class HomeController extends Controller {
  /**
   * @summary 获取服务器状态
   * @description Get请求获取服务器状态
   * @router get /status
   * @request query integer Id 查询的id
   * @response 200 getStatusResponse 返回结果
   */
  getStatus() {
    return this.ctx.success("Server Ready, Your params is 1");
  }

  /**
   * @summary 获取服务器状态
   * @description Post请求获取服务器状态
   * @Router POST /status
   * * @request body postStatusBody body
   * @Response 200 postStatusResponse ok
   */
  async postStatus() {
    const { ctx, app } = this;
    ctx.validate(ctx.rule.postStatusBody);
    return this.ctx.success("Server Ready, Your params is 1");
  }
}

module.exports = HomeController;
