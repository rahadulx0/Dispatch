function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const payload = { message: err.message || 'Server error' };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }
  if (err.errors && typeof err.errors === 'object') {
    payload.errors = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message || v])
    );
  }
  console.error(`[error] ${status} ${err.message}`);
  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
