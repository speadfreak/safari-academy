# 🦁 Safari Academy — Cinematic School Website + Admin Dashboard

A complete, production-ready, fully-dynamic, cinematic website and admin control room for **Safari Academy**, a multi-campus school in Addis Ababa, Ethiopia. Built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma (PostgreSQL), Framer Motion, and shadcn/ui.

> "Since 2005 • Nurturing Young Minds • Building Ethiopia's Future Leaders"

---

## ✨ Features at a Glance

### Public site (cinematic, immersive, fully CMS-driven)
- Cinematic preloader, custom cursor, scroll-progress bar, glass navbar with mega-menu, sticky animated footer, back-to-top with progress ring, command palette (⌘K), cookie banner, WhatsApp floating button, dark/light theme toggle.
- **All pages database-driven**: Home (hero slideshow, animated stats, bento, pinned learning path, campuses, news, events, testimonials, achievements, alumni, virtual-tour teaser), About, Admissions (spreadsheet-editable tuition), Academics, Campus & Facilities, Student Life (masonry + lightbox), News (list + detail with share), Events (list + detail with .ics + registration), Alumni, Virtual Tour (scroll-snapped chapters), Branches (list + detail), Contact (validated map + form), Privacy, Terms, FAQs, Policies, Student Support, Parent Portal, 404.

### Admin control room (`/#admin`)
- JWT httpOnly-cookie auth, RBAC (SUPER_ADMIN/ADMIN/EDITOR), audit log.
- Dashboard (stat cards + Recharts), and full CRUD for: Hero Slides, Branches, Team, News, Events, Gallery, Tuition tables, Alumni, Testimonials, FAQs, Inbox (5 tabs + CSV export), Legal Pages, Site Settings, Users & Roles, Audit Log, Profile.

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- **Node.js 20+** (or **Bun** — recommended)
- A **PostgreSQL** database (see below for a free Neon one)

### 1. Install
```bash
bun install        # or: npm install
```

### 2. Create a free Neon PostgreSQL database
1. Go to **https://neon.tech** → Sign up (free, no credit card).
2. Create a new project (e.g. "safari-academy").
3. On the project dashboard, copy the **Connection string** — it looks like:
   ```
   postgresql://neondb_owner:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set:
- `DATABASE_URL` → your Neon connection string from step 2
- `JWT_SECRET` → generate with `openssl rand -base64 48`
- (optional) `BLOB_READ_WRITE_TOKEN` → only needed if you want image uploads to work locally; otherwise uploads fall back to `/public/uploads` on disk.

### 4. Create the database schema
```bash
bun run db:push
```
This runs `prisma db push` — creates all tables in your Postgres DB.

### 5. Seed the database with demo content
```bash
bun run db:seed
```
This runs `tsx prisma/seed.ts` — populates 8 campuses, leadership, news, events, gallery, alumni, testimonials, FAQs, legal pages, and the default admin user. The seed is **idempotent** (safe to run multiple times — it clears seed content first, then re-inserts).

### 6. Run the dev server
```bash
bun run dev        # or: npm run dev
```
Open **http://localhost:3000** in your browser.

> 💡 In this sandboxed environment, view the app via the **Preview Panel** on the right. Use **Open in New Tab** for full-screen.

---

## 🔑 Default Admin Credentials
```
Email:    admin@safariacademy.com
Password: ChangeMe123!
```
> ⚠️ **Change this immediately** in production via the admin Profile page (open `/#admin` → login → Profile).

---

## 🌍 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (e.g. Neon). Format: `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | ✅ | Long random string used to sign JWT session tokens. Generate with `openssl rand -base64 48`. Min 16 chars. |
| `NODE_ENV` | — | `development` or `production`. Auto-set by Vercel. |
| `BLOB_READ_WRITE_TOKEN` | ✅ for prod | Vercel Blob token for image uploads. If unset, uploads fall back to local disk (dev only). |
| `NEXT_PUBLIC_SITE_URL` | — | Public site URL (for absolute links in emails/sitemap). |
| `SMTP_HOST` | optional | Email server host (for form-submission notifications). |
| `SMTP_PORT` | optional | Email server port (default 587). |
| `SMTP_USER` | optional | Email server username. |
| `SMTP_PASSWORD` | optional | Email server password. |
| `SMTP_FROM` | optional | "From" address for outgoing emails. |

> If SMTP vars are unset, form submissions are still stored in the database and visible in the admin Inbox — just no email notification is sent.

---

## ☁️ Deploy on Vercel

### Step 1 — Push to GitHub
This repo should already be on GitHub. If not, push it.

### Step 2 — Import into Vercel
1. Go to **https://vercel.com** → **Add New…** → **Project**.
2. Import your `safari-academy` GitHub repo.
3. Vercel auto-detects Next.js — keep the defaults:
   - **Framework Preset**: Next.js
   - **Build Command**: `bun run build` (or `npm run build`) — already runs `prisma generate && next build`
   - **Install Command**: `bun install` (or `npm install`) — `postinstall` also runs `prisma generate`
   - **Output Directory**: `.next` (auto)

### Step 3 — Add Environment Variables
In Vercel → Project → Settings → Environment Variables, add (for **Production**, **Preview**, and **Development**):
- `DATABASE_URL` → your Neon connection string
- `JWT_SECRET` → your generated secret
- `BLOB_READ_WRITE_TOKEN` → create a Blob store (Vercel → Storage → Create → Blob) and paste the token here

### Step 4 — Deploy
Click **Deploy**. Vercel builds the app and deploys. The first build takes ~1 min.

### Step 5 — Set up the production database (one-time, after first deploy)
Because Vercel's build sandbox doesn't run your `db:push` or `db:seed`, run them **once** against your production Neon DB from your local machine:

```bash
# Make sure your local .env has the PRODUCTION DATABASE_URL from Neon
bun run db:push     # creates tables in production
bun run db:seed     # seeds demo content + default admin
```

> The seed is idempotent — safe to re-run. It will NOT delete users or settings, only seed content (branches, news, events, etc.).

### Step 6 — Change the admin password
1. Visit `https://your-vercel-domain.vercel.app/#admin`
2. Login with `admin@safariacademy.com` / `ChangeMe123!`
3. Go to **Profile** → set a new password → Save.

### Step 7 — (Optional) Create a Vercel Blob store
Image uploads (admin → upload buttons) need a Blob store:
1. Vercel → your project → **Storage** → **Create** → **Blob**.
2. Copy the **Blob Read Write Token**.
3. Add it as `BLOB_READ_WRITE_TOKEN` env var (Production + Preview).
4. Redeploy (push any commit, or click Redeploy).

---

## 📂 Project Structure (key files)

```
.
├── prisma/
│   ├── schema.prisma        # PostgreSQL schema (~25 models)
│   └── seed.ts              # Idempotent seed (Ethiopian-context demo data)
├── public/
│   ├── brand/               # Logo (light/dark SVG) + favicon
│   └── uploads/.gitkeep    # Local-dev upload dir (gitignored contents)
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Fonts (Plus Jakarta Sans + Sora), providers
│   │   ├── page.tsx         # Renders <SafariApp />
│   │   ├── globals.css      # Brand design system
│   │   └── api/v1/           # public + admin REST endpoints
│   ├── components/
│   │   ├── global/          # Preloader, Navbar, Footer, Cursor, CommandPalette, …
│   │   ├── sections/         # Public pages (home, about, admissions, …)
│   │   ├── admin/            # Admin overlay + modules
│   │   └── ui/               # shadcn/ui
│   └── lib/                  # db, auth, session, settings, crud, upload, utils, store
├── .env.example              # Template — commit this
├── .gitignore                # Ignores .env, *.db, node_modules, /public/uploads/*, .next, .vercel
├── next.config.ts            # standalone output, image remotePatterns
├── package.json              # postinstall: prisma generate, build: prisma generate && next build
└── README.md
```

---

## 🛡 Security Notes

- **`JWT_SECRET`** is read from env only. In production, a missing/short secret throws (no hardcoded fallback).
- **Session cookies** are `httpOnly`, `sameSite=lax`, and `secure: true` when `NODE_ENV=production`.
- **Map iframe** src is validated against an allow-list (`google.com/maps`, `maps.google.com`, `openstreetmap.org`) — other URLs are rejected to prevent XSS.
- **Image uploads** validate MIME type and size (max 12MB). In production they go to Vercel Blob; locally to `/public/uploads`.
- **Rich-text HTML** (news/events/legal bodies) is sanitized before render (script tags + event handlers stripped).
- **Public forms** use Zod validation + a honeypot field.
- **Admin RBAC**: SUPER_ADMIN-only endpoints (users, audit-log) check role; prevents self-deletion and deleting the last super admin.

---

## 🧰 Common Commands

| Command | Description |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server on http://localhost:3000 |
| `bun run build` | `prisma generate && next build` |
| `bun run start` | Start production server (after build) |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to DB (create/update tables) |
| `bun run db:generate` | Regenerate Prisma Client (after schema changes) |
| `bun run db:migrate` | Create + apply a Prisma migration (dev) |
| `bun run db:reset` | Reset DB + re-run migrations (destructive!) |
| `bun run db:seed` | Seed demo content (idempotent) |

---

## 📝 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York) + Lucide icons
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (jose) + bcryptjs, httpOnly cookies, RBAC
- **State**: Zustand (client) + TanStack Query (server)
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Charts**: Recharts (admin)
- **Toasts**: sonner
- **Uploads**: @vercel/blob (prod) / local disk (dev fallback)
- **Fonts**: Plus Jakarta Sans (body) + Sora (display) via next/font

---

## 💛 Credits

**Designed with passion by Joseph James** — [https://onyx-jj.onrender.com/](https://onyx-jj.onrender.com/)

© 2026 Safari Academy. All Rights Reserved.
