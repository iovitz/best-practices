const Controller = require("../core/controller");

class HomeController extends Controller {
  getStatus() {
    return this.ctx.success("Hello");
  }
}

module.exports = HomeController;
