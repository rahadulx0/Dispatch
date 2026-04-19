const { z } = require('zod');

const CATEGORIES = [
  'World',
  'Business',
  'Markets',
  'Technology',
  'Politics',
  'Science',
  'Sports',
  'Lifestyle',
  'Opinion',
];

const tagsField = z
  .array(z.string().trim().toLowerCase().min(1).max(40))
  .max(10)
  .optional();

const createBlogSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content is too short'),
  excerpt: z.string().max(400).optional().default(''),
  coverImage: z.string().url().max(1000).optional().or(z.literal('')).default(''),
  coverImageKey: z.string().max(300).optional().or(z.literal('')).default(''),
  category: z.enum(CATEGORIES).default('World'),
  tags: tagsField.default([]),
  status: z.enum(['draft', 'published']).optional().default('published'),
});

const updateBlogSchema = createBlogSchema.partial();

const listBlogsQuery = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
    category: z.enum(CATEGORIES).optional(),
    tag: z.string().trim().min(1).max(40).optional(),
    q: z.string().trim().min(1).max(100).optional(),
    author: z.string().trim().optional(),
  })
  .passthrough();

const moderateSchema = z.object({
  status: z.enum(['draft', 'published']),
});

module.exports = {
  CATEGORIES,
  createBlogSchema,
  updateBlogSchema,
  listBlogsQuery,
  moderateSchema,
};
