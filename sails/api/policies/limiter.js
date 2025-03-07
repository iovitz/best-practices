module.exports = function (req, res, next) {
  const { clientId, userId } = req

  if (clientId && !sails.limiter.check(clientId)) {
    return res.tooManyRequest()
  }
  else if (userId && !sails.limiter.check(userId)) {
    return res.tooManyRequest()
  }

  return next()
}
