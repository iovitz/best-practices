module.exports = async function (req, res, next) {
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
  return next()
}
