const { ApiError } = require("../utils/apiError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message
      }));

      return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request", details));
    }

    // optionally assign parsed values (keeps future sanitization easy)
    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
