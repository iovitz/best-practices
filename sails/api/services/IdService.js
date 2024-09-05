/**
 * IdService
 *
 * @description :: 分发ID和ID校验等相关逻辑
 * @usage       :: IdService.[methodName]()
 */

const { customAlphabet } = require('nanoid');

const idGenerator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789', 9);

const Service = {
  genId(prefix) {
    return prefix + idGenerator();
  },
};

module.exports = Service;
