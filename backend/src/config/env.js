const dotenv = require("dotenv");

dotenv.config();

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function parseOrigins(v) {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),

  CLIENT_ORIGINS: parseOrigins(process.env.CLIENT_ORIGINS || "http://localhost:5173"),

  RATE_LIMIT_WINDOW_MIN: Number(process.env.RATE_LIMIT_WINDOW_MIN || 15),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 300)
};

module.exports = { env, requireEnv };
