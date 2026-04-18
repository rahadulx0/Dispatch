# Dispatch — News & Blogging Platform

A production-grade blogging CMS with a classic newspaper UI: serif headlines, orange accent, dense news grid, live ticker, trending strip, and a full-featured rich-text editor.

- **Frontend** → Next.js 14 / TypeScript / Tailwind, hosted on **Vercel**
- **Backend** → Node.js / Express / MongoDB, hosted on **Render**
- **Database** → MongoDB Atlas (recommended) — local Mongo for dev is fine
- **Media** → Uploaded images written to `/media` at the repo root and served by the backend at `/media/<filename>` (Render Disk mount recommended in production)

## Features

### Public (no auth)
- Newspaper-style homepage: hero article, top-stories rail, live ticker, **trending strip** (most read last 7 days), category strips per section
- Category landings (World, Business, Markets, Technology, Politics, Science, Sports, Lifestyle, Opinion)
- Article pages with serif body, cover image, related stories, JSON-LD `NewsArticle`, OG + Twitter cards
- **Fuzzy search** (`/search?q=…`) — typo-tolerant matching on title, excerpt, tags, category, and author name (powered by Fuse.js)
- Auto-generated `sitemap.xml` and `robots.txt`

### Contributor (`author` role)
- Register, login, logout, refresh (short-lived access + httpOnly refresh cookie)
- Full-featured TipTap editor: headings, bold/italic/underline/strike, lists, blockquote, code, alignment, links, inline image upload, undo/redo
- Draft & publish flow with category, tags, cover image, excerpt
- Dashboard showing published + drafts, per-post view counts, edit/delete
- Ownership enforced server-side

### Admin (`admin` role)
- `/admin` console with three tabs: **Overview** (stats), **Blogs** (moderate/unpublish/delete any post), **Users** (promote, demote, delete)
- `npm run seed:admin` script in `backend/` to bootstrap the first admin

### Production-ready
- **Auth**: JWT access (15m default) + refresh (14d default) with `tokenVersion` for forced-logout
- **Validation**: Zod schemas on every write endpoint
- **Security**: Helmet, CORS allow-list, credentialed cookies (`SameSite=None; Secure` in prod), rate-limiting on `/api` and `/api/auth`, bcrypt cost 12, DOMPurify on rendered HTML
- **Performance**: Next.js ISR, `next/image` AVIF/WebP, compression, MongoDB compound indexes on hot paths, `$text` search index on title/excerpt/content
- **Observability**: `/healthz`, morgan access logs, `[server] / [db] / [media]` prefixed boot lines
- **Modular backend**: controllers / services / middleware / models / routes / validators cleanly separated

## Repo layout

```
blogs/
├── backend/                      # Express API (Render)
│   ├── scripts/createAdmin.js    # npm run seed:admin
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/          # auth, blog, upload, admin
│   │   ├── middleware/           # auth, error, upload
│   │   ├── models/               # User, Blog
│   │   ├── routes/               # /api/auth|blogs|upload|admin
│   │   ├── services/mediaService.js
│   │   ├── utils/validate.js
│   │   ├── validators/           # Zod schemas
│   │   └── server.js
│   ├── .env.example
│   ├── render.yaml
│   └── package.json
├── frontend/                     # Next.js app (Vercel)
│   ├── app/
│   │   ├── admin/page.tsx        # admin console
│   │   ├── blog/[slug]/page.tsx  # article (JSON-LD, OG)
│   │   ├── category/[slug]/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── edit/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── search/page.tsx
│   │   ├── write/page.tsx
│   │   ├── sitemap.ts            # dynamic sitemap
│   │   ├── robots.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # Header, Footer, BlogCard, BlogForm, Editor, Ticker, TrendingStrip, RequireAuth, RequireRole, …
│   ├── contexts/AuthContext.tsx
│   ├── lib/                      # api, types, sanitize
│   ├── .env.local.example
│   ├── next.config.js
│   └── package.json
├── media/                        # Uploaded images (git-ignored)
└── README.md
```

## Quick start

Prereqs: Node ≥ 18 and MongoDB (local or Atlas).

**Terminal 1 — backend**
```bash
cd backend
cp .env.example .env
# set MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN=http://localhost:3000
npm install
npm run dev                 # http://localhost:5000
# optional: create an admin
ADMIN_EMAIL=admin@site.test ADMIN_PASSWORD=changeme123 npm run seed:admin
```

**Terminal 2 — frontend**
```bash
cd frontend
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000, NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm install
npm run dev                 # http://localhost:3000
```

Register at `/register`, publish at `/write`, moderate at `/admin`.

## Deploy

### 1. MongoDB
Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Whitelist `0.0.0.0/0` (or Render's IPs). Copy the connection string.

### 2. Backend → Render
See [`backend/README.md`](backend/README.md). The supplied `render.yaml` provisions the service **plus a 1 GB Disk** mounted at `/var/data`. Set:
- `MONGODB_URI` — Atlas URI
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — Render can auto-generate
- `CORS_ORIGIN=https://<your-frontend>.vercel.app`
- `PUBLIC_SITE_URL=https://<your-frontend>.vercel.app`
- `PUBLIC_MEDIA_URL=https://<your-backend>.onrender.com/media`
- `MEDIA_DIR=/var/data/media` **(critical — without this, uploaded images disappear on redeploy)**

### 3. Frontend → Vercel
See [`frontend/README.md`](frontend/README.md). Root Directory = `frontend`. Env:
- `NEXT_PUBLIC_API_URL=https://<your-backend>.onrender.com`
- `NEXT_PUBLIC_SITE_URL=https://<your-project>.vercel.app`

### 4. Wire them together
Copy the Vercel URL into the Render `CORS_ORIGIN` and `PUBLIC_SITE_URL` variables and redeploy the backend. Sessions need the exact origin — a wildcard won't work once cookies are involved.

## Design notes

The UI draws from classic newsroom design: a black masthead block with an orange `D` wordmark, an orange accent (`#FA6400`), serif headlines (Source Serif 4), sans-serif body (Inter), thin horizontal rules between sections, all-caps kickers, and a compact byline format (`By X · Y ago · Z min read`). Layout is a classic newspaper grid — big hero on the left, narrow "top stories" rail on the right, a trending strip on a grey band, then category strips below. Article pages use a centered measure (`max-w-article`) for readability, with tags and author bio under the body.

## License

See `LICENSE`.
