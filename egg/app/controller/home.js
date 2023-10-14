"use strict";

const Controller = require("../core/controller");

/**
 * @controller HomeController 根目录接口
 */
class HomeController extends Controller {
  /**
   * @summary 获取服务器状态
   * @description Get请求获取服务器状态
   * @router get /status （ get 表示设置请求为 get 请求，最后的 selectById 对应下面的 selectById 方法 ）。
   * @request query integer Id 需要去查新的ID。（ get 对应 query 请求，请求值设定为 integer 纯数字类型，ID 为请求的字段，注意大小写，和下面的方法要一一对应，不然会报错 ）。
   * @response 200 getStatusResponse 返回结果。（ 对应 contract 里面的验证属性，下面会提到 。）
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
