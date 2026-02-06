const mongoose = require("mongoose");
const { requireEnv, env } = require("../config/env");

async function connectDB() {
  const uri = requireEnv("MONGO_URI");

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: env.NODE_ENV !== "production"
  });

  console.log("✅ MongoDB connected");
}

function getDbState() {
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const state = mongoose.connection.readyState;

  const map = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  return {
    readyState: state,
    status: map[state] || "unknown"
  };
}

async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB disconnected");
  } catch (err) {
    console.error("MongoDB disconnect error:", err);
  }
}

module.exports = { connectDB, disconnectDB, getDbState };
