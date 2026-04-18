const mongoose = require('mongoose');
const slugify = require('slugify');
const { CATEGORIES } = require('../validators/blogSchemas');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, maxlength: 400, default: '' },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    coverImageKey: { type: String, default: '' },
    category: { type: String, enum: CATEGORIES, default: 'World', index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 1 },
    publishedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogSchema.index({ publishedAt: -1, createdAt: -1 });
blogSchema.index({ status: 1, publishedAt: -1 });

function makeSlug(title) {
  return slugify(title, { lower: true, strict: true, trim: true }).slice(0, 80);
}

blogSchema.pre('validate', async function assignSlug(next) {
  if (!this.isModified('title') && this.slug) return next();
  const Blog = this.constructor;
  let base = makeSlug(this.title);
  if (!base) base = 'post';
  let candidate = base;
  let n = 1;
  while (await Blog.exists({ slug: candidate, _id: { $ne: this._id } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  this.slug = candidate;
  next();
});

blogSchema.pre('save', function computeMeta(next) {
  if (this.isModified('content')) {
    const plain = String(this.content || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = plain ? plain.split(/\s+/).length : 0;
    this.readingTime = Math.max(1, Math.round(words / 220));
    if (!this.excerpt) {
      this.excerpt = plain.slice(0, 240);
    }
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Blog', blogSchema);
