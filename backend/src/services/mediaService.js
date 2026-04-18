const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function localDir() {
  return path.resolve(__dirname, '..', '..', process.env.MEDIA_DIR || '../media');
}

function ensureLocalDir() {
  const dir = localDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function publicUrl(req, filename) {
  const base = process.env.PUBLIC_MEDIA_URL;
  if (base) return `${base.replace(/\/$/, '')}/${filename}`;
  return `${req.protocol}://${req.get('host')}/media/${filename}`;
}

function extFromMime(type) {
  switch (type) {
    case 'image/jpeg': return '.jpg';
    case 'image/png':  return '.png';
    case 'image/webp': return '.webp';
    case 'image/gif':  return '.gif';
    case 'image/svg+xml': return '.svg';
    default: return '.bin';
  }
}

async function uploadBuffer(buffer, { mimeType, originalName, req }) {
  const dir = ensureLocalDir();
  const ext = (path.extname(originalName || '').toLowerCase()) || extFromMime(mimeType);
  const filename = `${Date.now()}-${crypto.randomBytes(12).toString('hex')}${ext}`;
  await fs.promises.writeFile(path.join(dir, filename), buffer);
  return {
    url: publicUrl(req, filename),
    key: filename,
    size: buffer.length,
    mimeType,
    provider: 'local',
  };
}

async function deleteAsset(key) {
  if (!key) return;
  if (!/^[\w.\-]+$/.test(key)) return;
  const dir = localDir();
  const full = path.join(dir, key);
  if (!full.startsWith(dir)) return;
  try {
    await fs.promises.unlink(full);
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn('[media] Local delete failed:', err.message);
  }
}

module.exports = { uploadBuffer, deleteAsset, localDir, ensureLocalDir };
