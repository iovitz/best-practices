/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const { stringify } = require('safe-stable-stringify')

module.exports.bootstrap = async function () {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //

  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // 打印启动日志方便排查问题
  rootLogger.bootstrap('Hooks initial success')
  if (__isProd) {
    rootLogger.bootstrap('App Environment', stringify(process.env))
    rootLogger.bootstrap('App Config', stringify(sails.config))
  }
  rootLogger.bootstrap(`Server will running in http://127.0.0.1:${sails.config.port}`)
  RequestService.getName()
}
