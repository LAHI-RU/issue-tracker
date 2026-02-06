const Issue = require("../models/Issue");
const { ApiError } = require("../utils/apiError");

function buildFilter(query) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.severity) filter.severity = query.severity;

  // Search: prefer text index if q exists
  if (query.q) {
    filter.$text = { $search: query.q };
  }

  return filter;
}

async function createIssue(req, res, next) {
  try {
    const { title, description, priority, severity } = req.validated.body;

    const issue = await Issue.create({
      title,
      description,
      priority,
      severity,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    res.status(201).json({ data: { issue } });
  } catch (err) {
    next(err);
  }
}

async function listIssues(req, res, next) {
  try {
    const { q, status, priority, severity, page, limit, sort } = req.validated.query;

    const filter = buildFilter({ q, status, priority, severity });
    const sortObj = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // If using $text search, sorting by textScore can be useful
    const projection = q ? { score: { $meta: "textScore" } } : {};
    const sortFinal = q ? { score: { $meta: "textScore" }, ...sortObj } : sortObj;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Issue.find(filter, projection).sort(sortFinal).skip(skip).limit(limit).lean(),
      Issue.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: { items },
      meta: { page, limit, total, totalPages }
    });
  } catch (err) {
    next(err);
  }
}

async function getIssue(req, res, next) {
  try {
    const { id } = req.validated.params;

    const issue = await Issue.findById(id).lean();
    if (!issue) throw new ApiError(404, "ISSUE_NOT_FOUND", "Issue not found");

    res.json({ data: { issue } });
  } catch (err) {
    next(err);
  }
}

async function updateIssue(req, res, next) {
  try {
    const { id } = req.validated.params;
    const updates = { ...req.validated.body, updatedBy: req.user.id };

    // Allow clearing optional fields by sending null
    if (Object.prototype.hasOwnProperty.call(updates, "priority") && updates.priority === null) {
      updates.priority = undefined;
    }
    if (Object.prototype.hasOwnProperty.call(updates, "severity") && updates.severity === null) {
      updates.severity = undefined;
    }

    const issue = await Issue.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!issue) throw new ApiError(404, "ISSUE_NOT_FOUND", "Issue not found");

    res.json({ data: { issue } });
  } catch (err) {
    next(err);
  }
}

async function updateIssueStatus(req, res, next) {
  try {
    const { id } = req.validated.params;
    const { status } = req.validated.body;

    const issue = await Issue.findById(id).lean();
    if (!issue) throw new ApiError(404, "ISSUE_NOT_FOUND", "Issue not found");

    // Basic sane rules (simple & interview-friendly):
    // CLOSED is terminal (only allow staying CLOSED)
    if (issue.status === "CLOSED" && status !== "CLOSED") {
      throw new ApiError(400, "INVALID_STATUS_TRANSITION", "Closed issues cannot be reopened");
    }

    const updated = await Issue.findByIdAndUpdate(
      id,
      { status, updatedBy: req.user.id },
      { new: true }
    ).lean();

    res.json({ data: { issue: updated } });
  } catch (err) {
    next(err);
  }
}

async function deleteIssue(req, res, next) {
  try {
    const { id } = req.validated.params;

    const deleted = await Issue.findByIdAndDelete(id).lean();
    if (!deleted) throw new ApiError(404, "ISSUE_NOT_FOUND", "Issue not found");

    res.json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
}

async function issueStats(req, res, next) {
  try {
    const counts = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
    for (const row of counts) result[row._id] = row.count;

    res.json({ data: { counts: result } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createIssue,
  listIssues,
  getIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  issueStats
};
