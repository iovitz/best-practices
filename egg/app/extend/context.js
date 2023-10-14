module.exports = {
  success(data, msg = "success") {
    this.status = 200;
    this.body = {
      code: 0,
      data,
      msg,
    };
  },
  paramsError(msg = "Bad Request") {
    this.status = 400;
    this.body = {
      code: 200,
      msg,
    };
  },
  authError(msg = "Login Request") {
    this.status = 403;
    this.body = {
      code: 40003,
      msg,
    };
  },
  serverError(msg = "Server Error", status = 500, code = 50000) {
    this.status = status;
    this.body = {
      code,
      msg,
    };
    
  },
};
