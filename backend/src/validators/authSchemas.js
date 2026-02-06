const { z } = require("zod");

const email = z.string().trim().toLowerCase().email();
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const registerSchema = z.object({
  body: z.object({
    email,
    password,
    name: z.string().trim().min(2).max(50).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, "Password is required")
  })
});

module.exports = { registerSchema, loginSchema };
