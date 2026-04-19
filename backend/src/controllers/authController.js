const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../middleware/auth');

const REFRESH_COOKIE = 'refresh_token';

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  const opts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: parseDurationMs(process.env.JWT_REFRESH_EXPIRES_IN || '14d'),
  };
  if (process.env.COOKIE_DOMAIN) opts.domain = process.env.COOKIE_DOMAIN;
  return opts;
}

function parseDurationMs(str) {
  const m = String(str).match(/^(\d+)\s*([smhd]?)$/i);
  if (!m) return 14 * 24 * 3600 * 1000;
  const n = parseInt(m[1], 10);
  const unit = (m[2] || 's').toLowerCase();
  const mult = { s: 1000, m: 60_000, h: 3600_000, d: 86_400_000 }[unit] || 1000;
  return n * mult;
}

function issueTokens(res, user) {
  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  return { accessToken, refreshToken };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      const e = new Error('An account with this email already exists');
      e.status = 409;
      throw e;
    }
    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = issueTokens(res, user);
    res.status(201).json({ user: user.toPublic(), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      const e = new Error('Invalid email or password');
      e.status = 401;
      throw e;
    }
    const { accessToken, refreshToken } = issueTokens(res, user);
    res.json({ user: user.toPublic(), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;
    if (!token) {
      const e = new Error('Refresh token missing');
      e.status = 401;
      throw e;
    }
    const decoded = verifyRefresh(token);
    const user = await User.findById(decoded.sub);
    if (!user) {
      const e = new Error('User no longer exists');
      e.status = 401;
      throw e;
    }
    if ((decoded.tv ?? 0) !== (user.tokenVersion || 0)) {
      const e = new Error('Session revoked');
      e.status = 401;
      throw e;
    }
    const { accessToken, refreshToken } = issueTokens(res, user);
    res.json({ user: user.toPublic(), accessToken, refreshToken });
  } catch (err) {
    if (!err.status) err.status = 401;
    if (!err.message) err.message = 'Invalid refresh token';
    next(err);
  }
}

async function logout(req, res) {
  if (req.user) {
    req.user.tokenVersion = (req.user.tokenVersion || 0) + 1;
    await req.user.save();
  }
  res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: 0 });
  res.json({ ok: true });
}

async function me(req, res) {
  res.json({ user: req.user.toPublic() });
}

async function updateProfile(req, res, next) {
  try {
    const { name, bio, avatar } = req.body;
    if (typeof name === 'string') req.user.name = name;
    if (typeof bio === 'string') req.user.bio = bio;
    if (typeof avatar === 'string') req.user.avatar = avatar;
    await req.user.save();
    res.json({ user: req.user.toPublic() });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, me, updateProfile };
