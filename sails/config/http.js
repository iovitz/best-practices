/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

const { ulid } = require('ulid')

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'www',
      'favicon',
      'logger',
      'requestInfo',
      'router',
    ],

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    logger: (function () {
      return function (req, res, next) {
        req.logger = res.logger = rootLogger.child({
          scope: ulid(),
        })
        return next()
      }
    })(),

    requestInfo: (function () {
      return async function (req, res, next) {
        const startTime = process.hrtime.bigint()
        res.logger.info(`Request Incoming: ${req.method} ${req.url}`, {
          ua: req.header('user-agent'),
        })

        res.on('finish', () => {
          const cost = process.hrtime.bigint() - startTime
          res.logger.info(`Connection finished With Status Code ${res.statusCode}`, { cost: cost.toString() })
        })

        res.on('close', () => {
          const cost = process.hrtime.bigint() - startTime
          res.logger.info(`Connection Closed With Status Code ${res.statusCode}`, { cost: cost.toString() })
        })
        next()
      }
    })(),

  },

  trustProxy: true,

}
