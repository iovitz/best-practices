module.exports = async function (req, res, next) {
  const { blockIps } = sails.config.custom
  if (blockIps && blockIps.includes(req.ip)) {
    return res.forbidden()
    // throw {
    //   code: 403,
    //   message: 'Access Denied: Your IP address is blocked due to suspicious activity.',
    // }
  }

  await next()
  return
}
