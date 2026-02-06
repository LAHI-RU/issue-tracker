const express = require("express");
const { getDbState } = require("../db/connect");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "issue-tracker-api",
    timestamp: new Date().toISOString(),
    db: getDbState()
  });
});

router.use("/auth", authRoutes);

module.exports = router;
