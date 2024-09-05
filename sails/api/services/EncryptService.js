/**
 * EncryptService
 *
 * @description :: 负责处理一些字符串加密逻辑
 * @usage       :: EncryptService.[methodName]()
 */

const bcrypt = require('bcryptjs');
const cryptoJS = require('crypto-js');
const pako = require('pako');

const Service = {

  ungzip(gzipBase64Str) {
    return JSON.parse(pako.ungzip(Buffer.from(gzipBase64Str, 'base64'), { to: 'string' }));
  },

  gzip(data) {
    return this.strToGzipBase64(JSON.stringify(data));
  },

  strToGzipBase64(str) {
    return Buffer.from(pako.gzip(str, { level: 9 })).toString('base64');
  },

  comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const pass = bcrypt.hash(password, salt);
    return pass;
  },

  aesEncrypt(message) {
    return cryptoJS.AES.encrypt(message, sails.config.secret.encrypt.aes).toString();
  },

  aesDecrypt(encrypted) {
    return cryptoJS.AES.decrypt(encrypted, sails.config.secret.encrypt.aes).toString(cryptoJS.enc.Utf8);
  },
};

module.exports = Service;
