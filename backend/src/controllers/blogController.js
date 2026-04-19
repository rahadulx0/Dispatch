const mongoose = require('mongoose');
const Fuse = require('fuse.js');
const Blog = require('../models/Blog');
const { deleteAsset } = require('../services/mediaService');

function isObjectId(v) {
  return mongoose.Types.ObjectId.isValid(v);
}

function getQuery(req) {
  return req.validatedQuery || req.query;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const FUSE_KEYS = [
  { name: 'title', weight: 5 },
  { name: 'excerpt', weight: 2 },
  { name: 'tags', weight: 2 },
  { name: 'category', weight: 1 },
  { name: 'author.name', weight: 1 },
];

async function fuzzyList(baseFilter, query, page, limit, skip, res) {
  const stemLen = Math.min(4, query.length);
  const stem = new RegExp(escapeRegex(query.slice(0, stemLen)), 'i');

  const [matched, recent] = await Promise.all([
    Blog.find({
      ...baseFilter,
      $or: [{ title: stem }, { excerpt: stem }, { tags: stem }, { category: stem }],
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(600)
      .populate('author', 'name avatar')
      .lean(),
    Blog.find(baseFilter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(400)
      .populate('author', 'name avatar')
      .lean(),
  ]);

  const seen = new Set();
  const pool = [];
  for (const doc of matched.concat(recent)) {
    const id = String(doc._id);
    if (seen.has(id)) continue;
    seen.add(id);
    pool.push(doc);
  }

  const fuse = new Fuse(pool, {
    keys: FUSE_KEYS,
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
  });

  const ranked = fuse.search(query).map((r) => r.item);
  const total = ranked.length;
  const items = ranked.slice(skip, skip + limit);

  return res.json({ items, page, limit, total, pages: Math.ceil(total / limit) || 0 });
}

async function list(req, res, next) {
  try {
    const q = getQuery(req);
    const page = q.page || 1;
    const limit = q.limit || 12;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };
    if (q.category) filter.category = q.category;
    if (q.author && isObjectId(q.author)) filter.author = q.author;
    if (q.tag) filter.tags = String(q.tag).toLowerCase();

    if (q.q) {
      const query = String(q.q).trim();
      if (query) return fuzzyList(filter, query, page, limit, skip, res);
    }

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .lean(),
      Blog.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function featured(_req, res, next) {
  try {
    const [hero, topStories, byCategory] = await Promise.all([
      Blog.findOne({ status: 'published' })
        .sort({ publishedAt: -1 })
        .populate('author', 'name avatar')
        .lean(),
      Blog.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .skip(1)
        .limit(6)
        .populate('author', 'name avatar')
        .lean(),
      Blog.aggregate([
        { $match: { status: 'published' } },
        { $sort: { publishedAt: -1 } },
        { $group: { _id: '$category', items: { $push: '$$ROOT' } } },
        { $project: { category: '$_id', items: { $slice: ['$items', 4] }, _id: 0 } },
      ]),
    ]);

    res.json({ hero, topStories, byCategory });
  } catch (err) {
    next(err);
  }
}

async function trending(_req, res, next) {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let items = await Blog.find({
      status: 'published',
      publishedAt: { $gte: since },
    })
      .sort({ views: -1, publishedAt: -1 })
      .limit(6)
      .populate('author', 'name avatar')
      .lean();
    if (items.length === 0) {
      items = await Blog.find({ status: 'published' })
        .sort({ views: -1, publishedAt: -1 })
        .limit(6)
        .populate('author', 'name avatar')
        .lean();
    }
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar bio')
      .lean();

    if (!blog) {
      const e = new Error('Blog not found');
      e.status = 404;
      throw e;
    }

    const related = await Blog.find({
      status: 'published',
      category: blog.category,
      _id: { $ne: blog._id },
    })
      .sort({ publishedAt: -1 })
      .limit(4)
      .populate('author', 'name avatar')
      .lean();

    res.json({ blog, related });
  } catch (err) {
    next(err);
  }
}

async function getMineById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      const e = new Error('Invalid id');
      e.status = 400;
      throw e;
    }
    const blog = await Blog.findById(id).populate('author', 'name avatar');
    if (!blog) {
      const e = new Error('Blog not found');
      e.status = 404;
      throw e;
    }
    if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      const e = new Error('Forbidden');
      e.status = 403;
      throw e;
    }
    res.json({ blog });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, content, excerpt, coverImage, coverImageKey, category, tags, status } = req.body;

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      coverImage,
      coverImageKey,
      category,
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'published',
      author: req.user._id,
    });

    await blog.populate('author', 'name avatar');
    res.status(201).json({ blog });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      const e = new Error('Invalid id');
      e.status = 400;
      throw e;
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      const e = new Error('Blog not found');
      e.status = 404;
      throw e;
    }
    const isOwner = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      const e = new Error('You can only edit your own posts');
      e.status = 403;
      throw e;
    }

    const previousKey = blog.coverImageKey;
    const fields = ['title', 'content', 'excerpt', 'coverImage', 'coverImageKey', 'category', 'tags', 'status'];
    for (const f of fields) {
      if (f in req.body) blog[f] = req.body[f];
    }
    await blog.save();
    if (previousKey && previousKey !== blog.coverImageKey) {
      await deleteAsset(previousKey);
    }
    await blog.populate('author', 'name avatar');
    res.json({ blog });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      const e = new Error('Invalid id');
      e.status = 400;
      throw e;
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      const e = new Error('Blog not found');
      e.status = 404;
      throw e;
    }
    const isOwner = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      const e = new Error('You can only delete your own posts');
      e.status = 403;
      throw e;
    }
    const keyToDelete = blog.coverImageKey;
    await blog.deleteOne();
    if (keyToDelete) await deleteAsset(keyToDelete);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function mine(req, res, next) {
  try {
    const items = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

async function categories(_req, res) {
  res.json({ categories: Blog.CATEGORIES });
}

async function allSlugs(_req, res, next) {
  try {
    const items = await Blog.find({ status: 'published' }, { slug: 1, updatedAt: 1, publishedAt: 1 })
      .sort({ publishedAt: -1 })
      .limit(5000)
      .lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  featured,
  trending,
  getBySlug,
  getMineById,
  create,
  update,
  remove,
  mine,
  categories,
  allSlugs,
};
