/**
 * ValidateService
 *
 * @description :: 校验规则
 * @usage       :: ValidateService.[methodName]()
 */
const Ajv = require('ajv');
const ajvFormats = require('ajv-formats');

const ajv = new Ajv();
ajvFormats(ajv);

const Service = {

  email: (() => ajv.compile({
    type: 'string',
    format: 'email', // 使用 'email' 格式验证
    minLength: 6,
    maxLength: 20,
  }))(),

  nickname: (() => ajv.compile({
    type: 'string',
    minLength: 2,
    maxLength: 10,
    pattern: '^\S+$',
  }))(),

  password: (() => ajv.compile({
    type: 'string',
    minLength: 6,
    maxLength: 16,
    // 字母数字和特殊字符
    pattern: '^[\\w#?!@$%^&*-\\.]+$',
  }))(),

  verifyCode: (() => ajv.compile({
    type: 'string',
    minLength: 4,
    maxLength: 4,
  }))(),
};

module.exports = Service;
