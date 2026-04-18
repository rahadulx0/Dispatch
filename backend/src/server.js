require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 5000;
const MEDIA_DIR = path.resolve(__dirname, '..', process.env.MEDIA_DIR || '../media');

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use(
  '/media',
  express.static(MEDIA_DIR, {
    maxAge: '30d',
    immutable: true,
    fallthrough: false,
  })
);

app.get('/', (_req, res) => {
  res.json({ name: 'Blogs API', status: 'ok', time: new Date().toISOString() });
});
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[server] Listening on :${PORT} (${process.env.NODE_ENV || 'development'})`);
      console.log(`[server] Media directory: ${MEDIA_DIR}`);
    });
  } catch (err) {
    console.error('[server] Startup failed:', err.message);
    process.exit(1);
  }
})();

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});
