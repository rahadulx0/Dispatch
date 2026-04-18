const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');

function isObjectId(v) {
  return mongoose.Types.ObjectId.isValid(v);
}

async function stats(_req, res, next) {
  try {
    const [users, authors, admins, blogs, published, drafts, totalViews] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'author' }),
      User.countDocuments({ role: 'admin' }),
      Blog.countDocuments({}),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      Blog.aggregate([{ $group: { _id: null, views: { $sum: '$views' } } }]),
    ]);
    res.json({
      users,
      authors,
      admins,
      blogs,
      published,
      drafts,
      views: totalViews[0]?.views || 0,
    });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const filter = {};
    if (req.query.q) {
      const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }
    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    res.json({
      items: items.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        bio: u.bio,
        avatar: u.avatar,
        createdAt: u.createdAt,
      })),
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!isObjectId(id)) {
      const e = new Error('Invalid id');
      e.status = 400;
      throw e;
    }
    if (!User.ROLES.includes(role)) {
      const e = new Error('Invalid role');
      e.status = 400;
      throw e;
    }
    if (id === req.user._id.toString() && role !== 'admin') {
      const e = new Error('You cannot demote yourself');
      e.status = 400;
      throw e;
    }
    const user = await User.findById(id);
    if (!user) {
      const e = new Error('User not found');
      e.status = 404;
      throw e;
    }
    user.role = role;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) {
      const e = new Error('Invalid id');
      e.status = 400;
      throw e;
    }
    if (id === req.user._id.toString()) {
      const e = new Error('You cannot delete your own account here');
      e.status = 400;
      throw e;
    }
    const user = await User.findById(id);
    if (!user) {
      const e = new Error('User not found');
      e.status = 404;
      throw e;
    }
    await Blog.deleteMany({ author: user._id });
    await user.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function listBlogs(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const filter = {};
    if (req.query.status && ['draft', 'published'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.q) {
      const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: rx }, { excerpt: rx }];
    }
    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'name email role')
        .lean(),
      Blog.countDocuments(filter),
    ]);
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function moderateBlog(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isObjectId(id) || !['draft', 'published'].includes(status)) {
      const e = new Error('Invalid request');
      e.status = 400;
      throw e;
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      const e = new Error('Blog not found');
      e.status = 404;
      throw e;
    }
    blog.status = status;
    await blog.save();
    res.json({ blog });
  } catch (err) {
    next(err);
  }
}

async function deleteBlog(req, res, next) {
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
    await blog.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  stats,
  listUsers,
  updateUserRole,
  deleteUser,
  listBlogs,
  moderateBlog,
  deleteBlog,
};
