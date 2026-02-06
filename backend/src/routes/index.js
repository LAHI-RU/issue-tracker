const express = require("express");
const { getDbState } = require("../db/connect");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "issue-tracker-api",
    timestamp: new Date().toISOString(),
    db: getDbState()
  });
});

module.exports = router;
