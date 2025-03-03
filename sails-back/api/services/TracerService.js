/**
 * TracerService
 *
 * @description :: 追踪请求日志
 * @usage       :: TracerService.[methodName]()
 */

const { customAlphabet } = require('nanoid');

const nanoidGenerator = customAlphabet('0123456789', 7);

const Service = {

  getLogInfo(req) {
    const requestId = _.get(req, 'tracer.id') || 'UNKNOWN';
    const cost = _.get(req, 'tracer.startTime');
    return {
      requestId,
      cost: cost ? process.hrtime.bigint() - cost : -1,
    };
  },

  debug(req, message = '', ...rest) {
    const { requestId, cost } = this.getLogInfo(req);
    sails.log.debug(`${requestId}(${cost.toString()}) - ${message}`, ...rest);
  },

  info(req, message = '', ...rest) {
    const { requestId, cost } = this.getLogInfo(req);
    sails.log.info(`${requestId}(${cost.toString()}) - ${message}`, ...rest);
  },

  warn(req, message = '', ...rest) {
    const { requestId, cost } = this.getLogInfo(req);
    sails.log.warn(`${requestId}(${cost.toString()}) - ${message}`, ...rest);
  },

  error(req, message = '', ...rest) {
    const { requestId, cost } = this.getLogInfo(req);
    sails.log.error(`${requestId}(${cost.toString()}) - ${message}`, ...rest);
  },

  genTraceId() {
    return Date.now() + nanoidGenerator();
  },
};

module.exports = Service;
