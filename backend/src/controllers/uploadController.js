const { uploadBuffer, deleteAsset } = require('../services/mediaService');

async function single(req, res, next) {
  try {
    if (!req.file) {
      const e = new Error('No file uploaded');
      e.status = 400;
      throw e;
    }
    const result = await uploadBuffer(req.file.buffer, {
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function multiple(req, res, next) {
  try {
    const files = req.files || [];
    if (!files.length) {
      const e = new Error('No files uploaded');
      e.status = 400;
      throw e;
    }
    const results = await Promise.all(
      files.map((f) =>
        uploadBuffer(f.buffer, {
          mimeType: f.mimetype,
          originalName: f.originalname,
        })
      )
    );
    res.status(201).json({ files: results });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { key } = req.params;
    if (!key) {
      const e = new Error('Key required');
      e.status = 400;
      throw e;
    }
    await deleteAsset(decodeURIComponent(key));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { single, multiple, remove };
