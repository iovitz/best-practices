/**
 * MySQL hook
 *
 * @description :: 初始刷MySQL的Sequelize链接
 */

const { Sequelize } = require('sequelize')

module.exports = function (sails) {
  const startTime = process.hrtime.bigint()
  // 配置连接参数
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/database.sqlite',
    dialectModule: require('sqlite3'),
    logging(sql) {
      sails.log.info(sql)
    },
    dialectOptions: {
      timezone: '+08:00',
    },
  })

  require('./user')(sequelize)

  sails.sequelize = sequelize

  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    async initialize() {
      // 开发环境下按需同步
      if (sails.config.environment === 'development') {
        await sequelize.sync() // 同步模型和数据库
      }

      const cost = Number(process.hrtime.bigint() - startTime).toLocaleString()
      LoggerService.bootstrap(`Initializing custom hook (\`sequelize\`), cost: ${cost}`)
    },

  }
}
