import { z } from "zod";

export const issueCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(5, "Description must be at least 5 characters").max(4000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  severity: z.enum(["MINOR", "MAJOR", "CRITICAL"]).optional().default("MINOR")
});

export const issueUpdateSchema = issueCreateSchema;
