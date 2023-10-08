const Service = require("egg").Service;

module.exports = class UserService extends Service {
  async testUserService() {
    return "user service works";
  }
};
