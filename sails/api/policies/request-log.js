module.exports = async function (req, res, next) {
  req.tracer = {
    startTime: process.hrtime.bigint(),
  }

  return next()
}
