module.exports = async function (req, res, next) {
  const tid = req.headers['request-id'] || TracerService.genTraceId();
  res.set('request-id', tid);
  req.tracer = {
    id: tid,
    startTime: process.hrtime.bigint(),
  };
  res.tracer = req.tracer;

  TracerService.info(res, '收到请求', {
    body: req.body || {},
    query: req.query || {},
    params: req.params || {},
  });

  return next();
};
