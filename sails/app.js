/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful,
 * such as when you deploy to a server, or a PaaS like Heroku.
 *
 * For example:
 *   => `node app.js`
 *   => `npm start`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *
 * The same command-line arguments and env vars are supported, e.g.:
 * `NODE_ENV=production node app.js --port=80 --verbose`
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/app.js
 */

// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
globalThis.__isProd = process.env.NODE_ENV === 'production'

const { log: { rootLogger } } = require('./config/log')

process.chdir(__dirname)

// 初始化一些全局变量
globalThis.rootLogger = rootLogger

// 捕获未处理的异常
process.on('uncaughtException', (err) => {
  rootLogger.error('Uncaught Exception:', err);
  // process.exit(1); // 如果需要终止进程可以调用此行代码
});

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  rootLogger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

setInterval(() => {
  const memoryUsage = process.memoryUsage();
  rootLogger.bootstrap(`Memory Usage: ${memoryUsage.rss / 1024 / 1024} MB`);
}, 1000 * 10);

// Attempt to import `sails` dependency, as well as `rc` (for loading `.sailsrc` files).
function bootstrap() {
  let sails
  let rc
  try {
    sails = require('sails')
    rc = require('sails/accessible/rc')

    sails.lift(rc('sails'))
  }
  catch (err) {
    rootLogger.error('-----')
    rootLogger.error('Encountered an error when attempting to require(\'sails\'):')
    rootLogger.error(err.stack)
    rootLogger.error('--')
    rootLogger.error('To run an app using `node app.js`, you need to have Sails installed')
    rootLogger.error('locally (`./node_modules/sails`).  To do that, just make sure you\'re')
    rootLogger.error('in the same directory as your app and run `npm install`.')
    rootLogger.error()
    rootLogger.error('If Sails is installed globally (i.e. `npm install -g sails`) you can')
    rootLogger.error('also run this app with `sails lift`.  Running with `sails lift` will')
    rootLogger.error('not run this file (`app.js`), but it will do exactly the same thing.')
    rootLogger.error('(It even uses your app directory\'s local Sails install, if possible.)')
  }// -•
}

bootstrap()
