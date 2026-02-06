const { z } = require("zod");
const { ISSUE_STATUS, ISSUE_PRIORITY, ISSUE_SEVERITY } = require("../models/Issue");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const createIssueSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(5000),
    priority: z.enum(ISSUE_PRIORITY).optional(),
    severity: z.enum(ISSUE_SEVERITY).optional()
  })
});

const updateIssueSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    title: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().min(10).max(5000).optional(),
    // allow clearing by sending null
    priority: z.enum(ISSUE_PRIORITY).nullable().optional(),
    severity: z.enum(ISSUE_SEVERITY).nullable().optional()
  })
});

const updateStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(ISSUE_STATUS)
  })
});

const getIssueSchema = z.object({
  params: z.object({ id: objectId })
});

const deleteIssueSchema = z.object({
  params: z.object({ id: objectId })
});

const listIssuesSchema = z.object({
  query: z.object({
    q: z.string().trim().max(200).optional(),
    status: z.enum(ISSUE_STATUS).optional(),
    priority: z.enum(ISSUE_PRIORITY).optional(),
    severity: z.enum(ISSUE_SEVERITY).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(5).max(50).optional().default(10),
    sort: z.enum(["newest", "oldest"]).optional().default("newest")
  })
});

module.exports = {
  createIssueSchema,
  updateIssueSchema,
  updateStatusSchema,
  getIssueSchema,
  deleteIssueSchema,
  listIssuesSchema
};
