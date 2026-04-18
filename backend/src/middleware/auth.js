const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ACCESS_SECRET = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET = () =>
  process.env.JWT_REFRESH_SECRET || `${ACCESS_SECRET()}-refresh`;

function signAccess(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, type: 'access', tv: user.tokenVersion || 0 },
    ACCESS_SECRET(),
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
}

function signRefresh(user) {
  return jwt.sign(
    { sub: user._id.toString(), type: 'refresh', tv: user.tokenVersion || 0 },
    REFRESH_SECRET(),
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '14d' }
  );
}

function verifyAccess(token) {
  const decoded = jwt.verify(token, ACCESS_SECRET());
  if (decoded.type && decoded.type !== 'access') throw new Error('Wrong token type');
  return decoded;
}

function verifyRefresh(token) {
  const decoded = jwt.verify(token, REFRESH_SECRET());
  if (decoded.type !== 'refresh') throw new Error('Wrong token type');
  return decoded;
}

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = verifyAccess(token);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    if ((decoded.tv ?? 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ message: 'Session revoked' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

async function optionalAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const decoded = verifyAccess(token);
    const user = await User.findById(decoded.sub);
    if (user && (decoded.tv ?? 0) === (user.tokenVersion || 0)) req.user = user;
  } catch {
    // optional — ignore
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  requireAuth,
  optionalAuth,
  requireRole,
};
