module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    try {
      await next();
    } catch (e) {
      ctx.logger.error(e);
      ctx.serverError();
    }
  };
};
