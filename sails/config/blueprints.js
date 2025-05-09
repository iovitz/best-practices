/**
 * Blueprint API Configuration
 * (sails.config.blueprints)
 *
 * For background on the blueprint API in Sails, check out:
 * https://sailsjs.com/docs/reference/blueprint-api
 *
 * For details and more available options, see:
 * https://sailsjs.com/config/blueprints
 */

const { ulid } = require('ulid')

module.exports.blueprints = {

  /***************************************************************************
  *                                                                          *
  * Automatically expose implicit routes for every action in your app?       *
  *                                                                          *
  ***************************************************************************/

  actions: false,

  /***************************************************************************
  *                                                                          *
  * Automatically expose RESTful routes for your models?                     *
  *                                                                          *
  ***************************************************************************/

  rest: true,

  /***************************************************************************
  *                                                                          *
  * Automatically expose CRUD "shortcut" routes to GET requests?             *
  * (These are enabled by default in development only.)                      *
  *                                                                          *
  ***************************************************************************/

  // 生产环境禁用
  shortcuts: !__isProd,

  pluralize: false,

  restPrefix: '/api/v1',

  parseBlueprintOptions(req) {
    // Get the default query options.
    let queryOptions = req._sails.hooks.blueprints.parseBlueprintOptions(req)

    // If this is the "find" or "populate" blueprint action, and the normal query options
    // indicate that the request is attempting to set an exceedingly high `limit` clause,
    // then prevent it (we'll say `limit` must not exceed 100).
    if (req.options.blueprintAction === 'find' || req.options.blueprintAction === 'populate') {
      if (queryOptions.criteria.limit > 100) {
        queryOptions.criteria.limit = 100
      }
    }
    // 所有的id由服务端生成
    if (req.options.blueprintAction === 'create') {
      req.body.id = ulid()
    }

    return queryOptions
  },

}
