const Service = require("egg").Service;

module.exports = class UserService extends Service {
  async testUserService() {
    // this.ctx.model.User;
    return "user service works";
  }
};
