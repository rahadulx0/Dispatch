const { ZodError } = require('zod');

function formatZodError(err) {
  const out = new Error('Validation failed');
  out.status = 400;
  out.errors = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_';
    out.errors[key] = { message: issue.message };
  }
  return out;
}

function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) return next(formatZodError(err));
      next(err);
    }
  };
}

function validateQuery(schema) {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req.query);
      Object.defineProperty(req, 'validatedQuery', { value: parsed, writable: true });
      next();
    } catch (err) {
      if (err instanceof ZodError) return next(formatZodError(err));
      next(err);
    }
  };
}

module.exports = { validateBody, validateQuery, formatZodError };
