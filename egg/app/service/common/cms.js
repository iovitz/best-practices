const Service = require("egg").Service;

module.exports = class CMSService extends Service {
  async storeCode(code) {
    return this.ctx.model.VerifyCode.create({
      code,
    });
  }
};
