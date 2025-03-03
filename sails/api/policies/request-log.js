module.exports = async function (req, res, next) {
  req.tracer = {
    startTime: process.hrtime.bigint(),
  }

  // TracerService.info(res, '收到请求', {
  //   body: req.body || {},
  //   query: req.query || {},
  //   params: req.params || {},
  // })

  return next()
}
