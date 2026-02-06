const mongoose = require("mongoose");

const ISSUE_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const ISSUE_PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const ISSUE_SEVERITY = ["MINOR", "MAJOR", "CRITICAL"];

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },

    status: { type: String, enum: ISSUE_STATUS, default: "OPEN", index: true },
    priority: { type: String, enum: ISSUE_PRIORITY, index: true },
    severity: { type: String, enum: ISSUE_SEVERITY, index: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Helpful indexes for list queries
issueSchema.index({ createdAt: -1 });
issueSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Issue", issueSchema);
module.exports.ISSUE_STATUS = ISSUE_STATUS;
module.exports.ISSUE_PRIORITY = ISSUE_PRIORITY;
module.exports.ISSUE_SEVERITY = ISSUE_SEVERITY;
