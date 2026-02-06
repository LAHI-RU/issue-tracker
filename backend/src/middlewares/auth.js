const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError");
const { requireEnv } = require("../config/env");

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return next(new ApiError(401, "UNAUTHORIZED", "Missing auth token"));

  try {
    const payload = jwt.verify(token, requireEnv("JWT_SECRET"));
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return next(new ApiError(401, "UNAUTHORIZED", "Invalid or expired token"));
  }
}

module.exports = { authRequired };
