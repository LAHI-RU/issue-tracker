const { ApiError } = require("../utils/apiError");

function validate(schema) {
  // Friendly dev error instead of "safeParse of undefined"
  if (!schema || typeof schema.safeParse !== "function") {
    throw new Error(
      "validate() received an invalid Zod schema. Check your import/export of the schema."
    );
  }

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

    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
