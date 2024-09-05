/**
 * MySQL hook
 *
 * @description :: 初始刷MySQL的Sequelize链接
 */

const { Sequelize } = require('sequelize');
const cryptoJS = require('crypto-js');

module.exports = function (sails) {
  const { mysql, encrypt } = sails.config.secret;

  console.log(cryptoJS.AES.decrypt(mysql.aesPassword, encrypt.aes).toString(cryptoJS.enc.Utf8));
  // 配置连接参数
  const sequelize = new Sequelize(mysql.dbName, mysql.user, cryptoJS.AES.decrypt(mysql.aesPassword, encrypt.aes).toString(cryptoJS.enc.Utf8), {
    host: mysql.host,
    dialect: 'mysql',
    logging(sql) {
      sails.log.info(sql);
    },
    dialectOptions: {
      timezone: '+08:00',
    },
  });

  require('./user')(sequelize);
  require('./user_profile')(sequelize);
  require('./session')(sequelize);

  sails.mysql = sequelize;

  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    async initialize() {
      // 开发环境下按需同步
      if (sails.config.environment === 'development') {
        await sequelize.sync(); // 同步模型和数据库
      }
      sails.log.info('Initializing custom hook (`sequelize`)');
    },

  };
};
