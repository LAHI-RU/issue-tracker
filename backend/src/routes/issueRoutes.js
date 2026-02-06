const express = require("express");
const { authRequired } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const {
  createIssueSchema,
  updateIssueSchema,
  updateStatusSchema,
  getIssueSchema,
  deleteIssueSchema,
  listIssuesSchema
} = require("../validators/issueSchemas");
const {
  createIssue,
  listIssues,
  getIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  issueStats
} = require("../controllers/issueController");

const router = express.Router();

router.use(authRequired);

router.get("/stats", issueStats);

router.post("/", validate(createIssueSchema), createIssue);
router.get("/", validate(listIssuesSchema), listIssues);
router.get("/:id", validate(getIssueSchema), getIssue);
router.patch("/:id", validate(updateIssueSchema), updateIssue);
router.patch("/:id/status", validate(updateStatusSchema), updateIssueStatus);
router.delete("/:id", validate(deleteIssueSchema), deleteIssue);

module.exports = router;
