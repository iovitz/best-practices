class Tracer {
  constructor(requestId) {
    this.logger = sails.log.child({
      requestId,
    })
  }

  silly(...args) {
    this.logger.info(...args)
  }

  info(...args) {
    this.logger.info(...args)
  }
}

module.exports = async function (req, res, next) {
  req.tracer = new Tracer()
  req.tracer.info('12312313')

  return next()
}
