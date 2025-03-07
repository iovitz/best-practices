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

const COOKIE_CLIENT_ID_KEY = 'client-id'
const HEADER_TRACE_ID_KEY = 'x-sails-log-id'

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
        const clientId = req.cookies[COOKIE_CLIENT_ID_KEY] ?? ulid()
        res.cookie(COOKIE_CLIENT_ID_KEY, clientId, {
          signed: false,
          maxAge: 360 * 24 * 60 * 60 * 1000,
          sameSite: 'strict',
          httpOnly: true,
        })
        // TODO 校验Log ID是否合法
        const traceId = req.header(HEADER_TRACE_ID_KEY) ?? `${clientId}-${ulid()}`

        req.clientId = res.clientId =clientId
        req.traceId = res.traceId = traceId
        req.logger = res.logger = globalThis.rootLogger.child({
          scope: traceId,
        })
        return next()
      }
    })(),

  },

  trustProxy: true,

  responses: {
    ok: {
      responseType: 'ok',
    },
    serverError: {
      responseType: 'serverError',
    },
    badRequest: {
      responseType: 'badRequest',
    },
    forbidden: {
      responseType: 'forbidden',
    },
    tooManyRequest: {
      responseType: 'tooManyRequest',
    },
    unprocessable: {
      responseType: 'unprocessable',
    },
  },
}
