# Backend — Blogs API

Node.js / Express / MongoDB API for the blogging platform. Designed for deployment on **Render**.

## Stack

- Express 4
- MongoDB via Mongoose 8 (MongoDB Atlas recommended in production)
- **Zod** for schema validation
- JWT access + refresh tokens (bcryptjs for hashing)
- Multer (memory storage) → images written to the root `/media` folder
- `cookie-parser`, Helmet, CORS allow-list, compression, rate-limit

## Folder structure

```
backend/
├── src/
│   ├── config/db.js              # Mongo connection
│   ├── controllers/              # auth, blog, upload, admin
│   ├── middleware/               # auth, error, upload
│   ├── models/                   # User, Blog
│   ├── routes/                   # /api/auth, /api/blogs, /api/upload, /api/admin
│   ├── services/mediaService.js  # local disk upload/delete
│   ├── utils/validate.js         # Zod → express middleware
│   ├── validators/               # Zod schemas
│   └── server.js
├── scripts/createAdmin.js        # `npm run seed:admin`
├── .env.example
├── render.yaml
└── package.json
```

## Local setup

```bash
cd backend
cp .env.example .env
# edit MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN
npm install
npm run dev
```

The API listens on `http://localhost:5000` and serves uploaded files at `http://localhost:5000/media/<filename>`.

### Seed an admin

```bash
# option 1 — interactive prompts
npm run seed:admin

# option 2 — via env
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=changeme123 npm run seed:admin
```

If the email already exists, the user is promoted to `role: admin`.

## Environment variables

| Variable                  | Required | Description                                                      |
| ------------------------- | -------- | ---------------------------------------------------------------- |
| `PORT`                    | no       | Server port. Render injects `10000` in prod.                     |
| `NODE_ENV`                | no       | `development` / `production`.                                    |
| `MONGODB_URI`             | **yes**  | Connection string (Mongo Atlas recommended).                     |
| `JWT_ACCESS_SECRET`       | **yes**  | Long random string. Signs short-lived access tokens.             |
| `JWT_REFRESH_SECRET`      | **yes**  | Different long random string. Signs refresh tokens.              |
| `JWT_ACCESS_EXPIRES_IN`   | no       | Default `15m`.                                                   |
| `JWT_REFRESH_EXPIRES_IN`  | no       | Default `14d`.                                                   |
| `COOKIE_DOMAIN`           | no       | Only set if backend + frontend share a parent domain.            |
| `CORS_ORIGIN`             | **yes**  | Comma-separated exact origins (cannot be `*` with cookies).      |
| `MEDIA_DIR`               | no       | Upload directory. Default `../media` (root of the repo).         |
| `PUBLIC_MEDIA_URL`        | no       | Absolute URL prefix for upload responses.                        |
| `MAX_UPLOAD_MB`           | no       | Max image size. Default `10`.                                    |
| `PUBLIC_SITE_URL`         | no       | Public frontend URL (used in links).                             |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | no | Used by `npm run seed:admin`.                                    |

## Auth flow

- **Access token**: short-lived JWT (default 15 min), returned in the JSON body as `accessToken`, held in memory by the frontend, sent as `Authorization: Bearer …`.
- **Refresh token**: long-lived JWT, set as an **httpOnly `Secure` cookie** (`refresh_token`) scoped to `/api/auth`. The browser sends it automatically.
- **`POST /api/auth/refresh`**: mints a new access token from the cookie.
- **`POST /api/auth/logout`**: bumps the user's `tokenVersion`, invalidating every outstanding access & refresh token on the server side, and clears the cookie.

Because the refresh cookie is cross-origin (Vercel frontend ↔ Render backend), cookies are set with `SameSite=None; Secure` in production, which requires HTTPS on both ends and `CORS_ORIGIN` listing the exact frontend origin.

## API endpoints

### Auth (`/api/auth`)
| Method | Path        | Auth       | Purpose                                    |
| ------ | ----------- | ---------- | ------------------------------------------ |
| POST   | `/register` | —          | Create account, returns access + refresh   |
| POST   | `/login`    | —          | Sign in, returns access + refresh          |
| POST   | `/refresh`  | cookie     | Issue new access token                     |
| POST   | `/logout`   | bearer     | Revoke session, clear cookie               |
| GET    | `/me`       | bearer     | Current user                               |
| PATCH  | `/me`       | bearer     | Update name / bio / avatar                 |

### Blogs (`/api/blogs`)
| Method | Path              | Auth      | Purpose                                                   |
| ------ | ----------------- | --------- | --------------------------------------------------------- |
| GET    | `/`               | —         | Paginated list. Query: `page`, `limit`, `category`, `tag`, `q` (fuzzy), `author` |
| GET    | `/featured`       | —         | Hero + top stories + category strips                      |
| GET    | `/trending`       | —         | Most viewed posts in the last 7 days                      |
| GET    | `/categories`     | —         | Array of valid category names                             |
| GET    | `/slugs`          | —         | All published slugs (for sitemap.xml)                     |
| GET    | `/mine`           | bearer    | Author's own posts (drafts + published)                   |
| GET    | `/mine/:id`       | bearer    | One of the author's own posts (for edit)                  |
| GET    | `/:slug`          | —         | Single post + related; increments view count              |
| POST   | `/`               | bearer    | Create post                                               |
| PUT    | `/:id`            | bearer    | Update (owner or admin)                                   |
| DELETE | `/:id`            | bearer    | Delete (owner or admin)                                   |

### Upload (`/api/upload`)
| Method | Path         | Auth   | Purpose                                                  |
| ------ | ------------ | ------ | -------------------------------------------------------- |
| POST   | `/image`     | bearer | Single image, field `image` → `{ url, key, size, … }`    |
| POST   | `/images`    | bearer | Multiple images (up to 10), field `images`               |
| DELETE | `/:key`      | bearer | Remove an uploaded file                                  |

### Admin (`/api/admin`) — role `admin` only
| Method | Path                   | Purpose                             |
| ------ | ---------------------- | ----------------------------------- |
| GET    | `/stats`               | Counts and totals                   |
| GET    | `/users`               | Paginated user list (search via `q`)|
| PATCH  | `/users/:id/role`      | Promote / demote                    |
| DELETE | `/users/:id`           | Delete user and their posts         |
| GET    | `/blogs`               | Paginated blog list (any status)    |
| PATCH  | `/blogs/:id/status`    | Publish / unpublish                 |
| DELETE | `/blogs/:id`           | Delete any post                     |

### Health & static
- `GET /healthz` — health check for Render
- `GET /media/:filename` — uploaded assets

## Deploying to Render

### Option A — `render.yaml` Blueprint (recommended)

`backend/render.yaml` declares:
- the web service with Root Directory `backend`
- all env vars (secrets marked `sync: false`)
- a **1 GB Disk** mounted at `/var/data`

After the first deploy, fill in:
- `MONGODB_URI` — Atlas connection string
- `CORS_ORIGIN=https://<your-frontend>.vercel.app`
- `PUBLIC_SITE_URL=https://<your-frontend>.vercel.app`
- `PUBLIC_MEDIA_URL=https://<your-backend>.onrender.com/media`
- `MEDIA_DIR=/var/data/media` *(to use the mounted Disk; otherwise uploads are wiped on every redeploy)*

### Option B — manual

1. **New → Web Service**, connect the repo.
2. **Root Directory**: `backend`
3. **Build Command**: `npm ci --omit=dev`
4. **Start Command**: `npm start`
5. **Health Check Path**: `/healthz`
6. Add env vars from `.env.example`.
7. Attach a Disk at `/var/data` and set `MEDIA_DIR=/var/data/media` for persistent media.

### Why a Disk?

Render's container filesystem is ephemeral — files get wiped on every deploy and may not be shared across instances. The root `/media` folder works fine for local development, but for production you either:
1. Attach a Render Disk (configured in `render.yaml`) and point `MEDIA_DIR` inside the mount, or
2. Swap `mediaService.js` for an object-storage provider.

The API surface stays identical because controllers only call `uploadBuffer` / `deleteAsset` on the service.
