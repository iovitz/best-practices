# duuk-server

## 项目概述

## 准备`config/local.js`文件

```js
/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */
module.exports = {

  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Sendgrid, etc.)

  secret: {
    // mysql.sqlpub.com申请的免费开发邮箱
    mysql: {
      host: 'mysql.sqlpub.com',
      dbName: 'duuk_server',
      user: 'duuk_server',
      // 用 `encrypt.aes` 进行AES加密之后的password，避免明文展示密码
      aesPassword: 'U2FsdGVkX1+prMWzXmqIsNyV1X4svmDjqhTvHKZbGiQAK2D/w6M76fbEVsHqWlY1',
    },

    // https://multiavatar.com/ 申请的头像Key
    // 用 `encrypt.aes` 进行AES加密之后的key，**避免明文展示**
    aesMultiAvatarKey: 'U2FsdGVkX18WZxy00fKmcEz26pqoJ6N+mvkQWRwvkqc=',

    encrypt: {
      // 随机生成的nanoid
      aes: 'D8a8c1Ff5tMtdoaZiqfbU',
    },
  },

  port: 5001,
};
```

## 开发规范

### 数据库

DB名称以及字段名称统一使用小驼峰，并且在使用Sequelize开发时，确保Sequelize的Model中的字段名和DB中的字段名保持一致

## 变量命名
