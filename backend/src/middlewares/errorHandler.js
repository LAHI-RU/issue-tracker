function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  next;

  console.error(`[${req.requestId || "no-req-id"}]`, err);

  const status = err.statusCode || 500;

  res.status(status).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "Something went wrong",
      details: err.details,
      requestId: req.requestId
    }
  });
}

module.exports = { errorHandler };
