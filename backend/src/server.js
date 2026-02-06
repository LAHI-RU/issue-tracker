const app = require("./app");
const { env } = require("./config/env");
const { connectDB, disconnectDB } = require("./db/connect");

let server;

async function start() {
  try {
    await connectDB();

    server = app.listen(env.PORT, () => {
      console.log(`API running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("🛑 HTTP server closed");
    }

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error("Shutdown error:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
