/**
 * VerifyService
 *
 * @description :: 验证相关
 * @usage       :: VerifyService.[methodName]()
 */

const moment = require('moment');
const svgCaptcha = require('svg-captcha');

const Service = {

  getVerifyCode(width, height, length = 4) {
    return svgCaptcha.create({
      size: length, // 验证码长度
      ignoreChars: 'o01ijlaqf', // 忽略字符
      color: false, // 是否采用彩色字符串
      noise: Math.floor(Math.random() * 3), // 干扰线条
      width, // 图片宽
      height, // 图片长
    });
  },

  checkVerifyCode(session, type, text) {
    // 获取验证码
    const code = session[`#c_${type}`] ?? '';
    const codeTime = session[`#t_${type}`] ?? '';
    // 判断验证码是不是30Min内下发的
    if (moment(codeTime).add(30, 'M') < moment(Date.now())) {
      sails.log.warn('验证码过期', codeTime);
      return false;
    }
    if (text.toLowerCase() !== code.toLowerCase()) {
      sails.log.warn('验证码校验失败', {
        input: text.toLowerCase(),
        right: code.toLowerCase(),
      });
      return false;
    }
    delete session[`#c_${type}`];
    delete session[`#t_${type}`];
    return true;
  },

};

module.exports = Service;
