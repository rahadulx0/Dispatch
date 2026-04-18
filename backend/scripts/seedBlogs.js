/**
 * Seed blog posts from the repo's /blogs folder into MongoDB.
 *
 *   node scripts/seedBlogs.js                 # write to DB
 *   node scripts/seedBlogs.js --dry-run       # preview without writing
 *
 * Env overrides:
 *   SEED_AUTHOR_EMAIL, SEED_AUTHOR_NAME, SEED_AUTHOR_PASSWORD, SEED_AUTHOR_BIO
 *   BLOGS_DIR (defaults to ../blogs relative to backend root)
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const matter = require('gray-matter');
const { marked } = require('marked');

const Blog = require('../src/models/Blog');
const User = require('../src/models/User');

const DRY_RUN = process.argv.includes('--dry-run');
const BLOGS_DIR = process.env.BLOGS_DIR
  ? path.resolve(process.env.BLOGS_DIR)
  : path.resolve(__dirname, '../../blogs');

marked.setOptions({ gfm: true, breaks: false });

function inferCategory(title, tags) {
  const titleLower = String(title).toLowerCase();
  const tagStr = (tags || []).join(' ').toLowerCase();
  const hay = `${titleLower} ${tagStr}`;

  // Strong title-driven signals first (these beat mislabeled tags)
  if (
    /journal/.test(titleLower) ||
    /\bielts\b/.test(titleLower) ||
    /\b(wellness|mental|gratitude|habit)\b/.test(titleLower)
  ) {
    return 'Lifestyle';
  }
  if (/software company/.test(titleLower) || /\b(startup|entrepreneur|enterprenuer)\b/.test(titleLower)) {
    return 'Business';
  }

  // Tech signals from title or tags — Salesforce titles often include the word "business"
  if (
    /\b(salesforce|apex|aura|lwc|visualforce|trailhead|flow builder|lightning|appexchange|javascript|typescript|react|node|nodejs|python|database|sql|nosql|oop|sdlc|dsa|algorithm|frontend|backend|terminal|powershell|cmd|css|html|ics protocol|iot|cyber|hacking|tutorial|output tracing|async)\b/.test(
      hay,
    )
  ) {
    return 'Technology';
  }

  // Tag-only fallbacks
  if (/\bielts\b/.test(tagStr) || /\b(wellness|mental|gratitude|habit)\b/.test(tagStr)) {
    return 'Lifestyle';
  }
  if (/\b(startup|entrepreneur|enterprenuer)\b/.test(tagStr)) {
    return 'Business';
  }

  return 'Technology';
}

function normalizeTags(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    const s = String(item || '').trim().toLowerCase();
    if (!s || s.length > 40 || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= 10) break;
  }
  return out;
}

function buildExcerpt(markdown, fallback = '') {
  if (fallback) return fallback.slice(0, 400);
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (const p of paragraphs) {
    if (p.startsWith('#') || p.startsWith('```') || p.startsWith('---')) continue;
    const plain = p
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^[>\s]+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length >= 40) {
      return plain.length > 380 ? plain.slice(0, 379).trimEnd() + '…' : plain;
    }
  }
  return '';
}

function safeCoverImage(raw) {
  if (!raw || typeof raw !== 'string') return '';
  if (/^https?:\/\//i.test(raw.trim())) return raw.trim();
  return '';
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/i, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function resolveAuthor() {
  const email = (process.env.SEED_AUTHOR_EMAIL || '').toLowerCase().trim();
  const fallbackEmail = email || 'author@dispatch.local';
  const name = process.env.SEED_AUTHOR_NAME || 'ZeroMargin';

  if (DRY_RUN) {
    return {
      user: { _id: 'DRY_RUN_AUTHOR', name, email: fallbackEmail, role: 'admin' },
      created: false,
    };
  }

  if (email) {
    const existing = await User.findOne({ email });
    if (existing) return { user: existing, created: false };
  }

  const anyAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
  if (anyAdmin) return { user: anyAdmin, created: false };

  const anyUser = await User.findOne().sort({ createdAt: 1 });
  if (anyUser) return { user: anyUser, created: false };

  const password =
    process.env.SEED_AUTHOR_PASSWORD ||
    (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 16);
  const bio =
    process.env.SEED_AUTHOR_BIO ||
    'Writer and developer covering software, Salesforce, and career topics.';

  const user = await User.create({
    name,
    email: fallbackEmail,
    password,
    role: 'admin',
    bio,
  });
  return { user, created: true, password };
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in backend/.env');
  }
  if (!fs.existsSync(BLOGS_DIR) || !fs.statSync(BLOGS_DIR).isDirectory()) {
    throw new Error(`Blogs folder not found at ${BLOGS_DIR}`);
  }

  console.log(`[seed] blogs dir: ${BLOGS_DIR}`);
  console.log(`[seed] mode    : ${DRY_RUN ? 'dry-run (no writes)' : 'writing to MongoDB'}`);

  if (!DRY_RUN) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[seed] connected to MongoDB');
  }

  const { user: author, created, password } = await resolveAuthor();
  console.log(`[seed] author  : ${author.name} <${author.email}> (${created ? 'created' : 'existing'})`);
  if (created && password) {
    console.log(`[seed] password: ${password}  ← save this; hashed in DB`);
  }

  const files = fs
    .readdirSync(BLOGS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .sort();

  console.log(`[seed] files   : ${files.length}`);

  const summary = { created: 0, updated: 0, skipped: 0 };
  const perCategory = {};

  for (const filename of files) {
    const filePath = path.join(BLOGS_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data || {};
    const body = String(parsed.content || '').trim();

    if (!body) {
      console.log(`  [skip] ${filename} — empty body`);
      summary.skipped += 1;
      continue;
    }

    const title = (fm.title && String(fm.title).trim()) || titleFromFilename(filename);
    const tags = normalizeTags(fm.tags);
    const category = inferCategory(title, tags);
    const coverImage = safeCoverImage(fm.coverImage);
    const html = marked.parse(body);
    const excerpt = buildExcerpt(body, (fm.description || '').toString().trim());

    perCategory[category] = (perCategory[category] || 0) + 1;

    if (DRY_RUN) {
      console.log(
        `  [dry] ${category.padEnd(11)} ${tags.length ? '[' + tags.join(', ') + ']' : ''}  ${title}`
      );
      summary.created += 1;
      continue;
    }

    const existing = await Blog.findOne({ title });
    if (existing) {
      existing.content = html;
      existing.excerpt = excerpt;
      existing.tags = tags;
      existing.category = category;
      existing.coverImage = coverImage;
      existing.status = 'published';
      existing.author = author._id;
      await existing.save();
      console.log(`  [upd] ${category.padEnd(11)} ${title}`);
      summary.updated += 1;
    } else {
      await Blog.create({
        title,
        content: html,
        excerpt,
        tags,
        category,
        coverImage,
        status: 'published',
        author: author._id,
      });
      console.log(`  [new] ${category.padEnd(11)} ${title}`);
      summary.created += 1;
    }
  }

  console.log('\n[seed] per-category breakdown:');
  for (const [cat, n] of Object.entries(perCategory)) {
    console.log(`  ${cat.padEnd(11)} ${n}`);
  }
  console.log(
    `\n[seed] done. created=${summary.created} updated=${summary.updated} skipped=${summary.skipped}`
  );

  if (!DRY_RUN) await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[seed] error:', err);
  process.exit(1);
});
