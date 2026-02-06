const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const apiRoutes = require("./routes");
const { requestId } = require("./middlewares/requestId");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Request ID early (for tracing)
app.use(requestId);

// Security headers
app.use(helmet());

// Rate limit (apply to all /api routes)
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again later."
    }
  }
});

// Request logging (include request id)
morgan.token("rid", (req) => req.requestId || "-");
app.use(morgan(":rid :method :url :status - :response-time ms"));

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (allow multiple origins)
app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools (Postman/Thunder) where origin is undefined
      if (!origin) return callback(null, true);

      if (env.CLIENT_ORIGINS.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

// Routes
app.use("/api", limiter, apiRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
