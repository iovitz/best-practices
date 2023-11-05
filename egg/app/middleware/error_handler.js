module.exports = (options, app) => {
  return async function notFoundHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.logger.error(err);
      if (!err) return;
      const { statusCode, errCode } = err;
      const message =
        statusCode === 500 && app.isProd
          ? "Internal Server Error"
          : err.message ?? err.msg;
      ctx.serverError(
        message,
        typeof statusCode === "number" ? statusCode : 500,
        typeof errCode === "number" ? errCode : 50000,
      );
    }
  };
};
