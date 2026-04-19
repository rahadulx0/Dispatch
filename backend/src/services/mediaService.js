const cloudinary = require('cloudinary').v2;

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    const e = new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    );
    e.status = 500;
    throw e;
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
}

function folder() {
  return process.env.CLOUDINARY_FOLDER || 'blogs';
}

async function uploadBuffer(buffer, { mimeType, originalName } = {}) {
  ensureConfigured();
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder(),
        resource_type: 'image',
        use_filename: Boolean(originalName),
        unique_filename: true,
        overwrite: false,
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    );
    stream.end(buffer);
  });
  return {
    url: result.secure_url,
    key: result.public_id,
    size: result.bytes,
    mimeType,
    width: result.width,
    height: result.height,
    format: result.format,
    provider: 'cloudinary',
  };
}

async function deleteAsset(key) {
  if (!key) return;
  ensureConfigured();
  try {
    await cloudinary.uploader.destroy(key, { resource_type: 'image', invalidate: true });
  } catch (err) {
    console.warn('[media] Cloudinary delete failed:', err.message);
  }
}

module.exports = { uploadBuffer, deleteAsset };
