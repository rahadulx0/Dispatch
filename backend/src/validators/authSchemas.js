const { z } = require('zod');

const emailField = z.string().trim().toLowerCase().email('Valid email required');
const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be 2–80 chars').max(80),
  email: emailField,
  password: passwordField,
});

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password required'),
});

const profileSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    bio: z.string().max(500).optional(),
    avatar: z.string().url().max(500).optional().or(z.literal('')),
  })
  .strict();

module.exports = { registerSchema, loginSchema, profileSchema };
