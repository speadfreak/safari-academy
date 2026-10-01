# 🦁 Safari Academy — Cinematic School Website + Admin Dashboard

A complete, production-ready, fully-dynamic, cinematic website and admin control room for **Safari Academy**, a multi-campus school in Addis Ababa, Ethiopia. Built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma, Framer Motion, and shadcn/ui.

> "Since 2005 • Nurturing Young Minds • Building Ethiopia's Future Leaders"

---

## ✨ Features

### Public site (cinematic, immersive, fully CMS-driven)
- **Cinematic preloader** with logo draw, progress counter, tagline typewriter, and clip-path curtain reveal.
- **Custom cursor** with hover state (desktop only, disabled on touch & reduced-motion).
- **Scroll progress bar** at the top of every page.
- **Glass navbar** that hides on scroll-down, reveals on scroll-up, with mega-menu dropdowns.
- **Sticky footer** with animated wordmark, marquee, newsletter, dynamic campus list, social links, and credit.
- **Back-to-top** button with circular scroll-progress ring.
- **Command palette (⌘K / Ctrl+K)** for instant search across pages, branches, news, events.
- **Cookie consent** banner (editable text).
- **Theme toggle** (light/dark) with `next-themes`, dark mode is the cinematic default.
- **WhatsApp floating button** (admin-managed number).

### Public pages (all database-driven)
1. **Home** — Hero slideshow with Ken Burns + parallax + firefly particles + animated stats bar; Welcome; Why-Choose bento; pinned Learning Path (KG → High); 8 campuses; Programs; Admissions CTA with countdown; News; Events; Testimonials; Achievements timeline; Alumni spotlight; Virtual-tour teaser; Final CTA. Every section is reorderable / toggleable from the admin.
2. **About Us** — Story timeline, Mission/Vision/Values, Leadership cards, Partners strip.
3. **Admissions** — 5-step process, requirements tabs (KG/Primary/Middle/High), important dates, **spreadsheet-editable tuition tables**, scholarships, online inquiry form (stored in DB + admin Inbox), FAQ.
4. **Academics** — Overview, Programs tabs, Curriculum, Trips & Extracurricular, Facilities grid, Administrative & Support team filter.
5. **Campus & Facilities** — Bento gallery, safety stats, branches CTA.
6. **Student Life** — Filterable masonry gallery with lightbox.
7. **News** list + **News detail** (`/news/:slug` rendered via SPA state) — cover, reading progress, rich body, tags, share buttons (copy/WhatsApp/Telegram/Facebook/X), prev/next, related.
8. **Events** list + **Event detail** — upcoming/past toggle, countdown to next event, registration form, "Add to Calendar" (.ics), share, related.
9. **Alumni** — Distinguished alumni cards, give-back/mentor stats, join-network form.
10. **Virtual Tour** — Scroll-snapped chapters, one per campus, with embedded video tours.
11. **Branches** list + **Branch detail** — 8 campuses, cover, stats, facilities, gallery, video tour, contact, map embed.
12. **Contact** — Cards, **sandboxed map iframe** (admin-managed, validated against google.com / openstreetmap.org allow-list), validated contact form with honeypot, branches quick-contact.
13. **Legal** — Privacy & Terms with sticky table of contents.
14. **FAQs, Policies, Student Support, Parent Portal** support pages.
15. **404** — Cinematic "Lost in the savannah".

### Admin control room (`#admin` or open via mobile menu → "Admin Login")
A separate full-screen admin app inside the same Next.js client, protected by JWT httpOnly cookies with role-based access (`SUPER_ADMIN`, `ADMIN`, `EDITOR`).

Modules:
1. **Dashboard** — Stat cards, 7-day inquiries trend (area chart), content overview (bar chart), recent messages & inquiries.
2. **Hero Slides** — CRUD, reorder, image upload, CTAs, overlay strength.
3. **Branches** — Full CRUD with cover image, facilities, video tour URL, map embed.
4. **Team** — Leadership + Staff, photo upload, role/department, bios, socials.
5. **News** — CRUD, HTML body, cover image upload, tags, status (draft/published/scheduled), featured.
6. **Events** — CRUD, date/time, venue, registration toggle, featured.
7. **Gallery** — CRUD with image upload, category, featured flag.
8. **Tuition & Fees** — Spreadsheet-like editor: add/remove/reorder columns & rows, edit cells inline, highlight rows, publish toggle, PDF upload.
9. **Alumni** — Profile CRUD with photo, sector, socials.
10. **Testimonials** — CRUD with rating, avatar.
11. **FAQs** — CRUD with category.
12. **Inbox** — Contact messages, admission inquiries, alumni applications, subscribers, event registrations — search, status, CSV export.
13. **Legal Pages** — Edit Privacy & Terms with HTML body and last-updated label.
14. **Site Settings** — Branding, contact, footer, SEO, preloader, admissions, cookies, social — all in one form with live site refresh on save.
15. **Users & Roles** (SUPER_ADMIN only) — Create/edit/delete users, assign roles, reset passwords, activate/deactivate (prevents self-deactivation & deleting the last super admin).
16. **Audit Log** (SUPER_ADMIN only) — Filterable activity feed.
17. **Profile** — Update name/email/password.

### Tech & Architecture
- **Next.js 16** App Router (single visible `/` route renders an SPA-like experience with virtual routing for sub-pages).
- **TypeScript** strict mode.
- **Prisma + SQLite** with a clean, normalized schema (~25 models).
- **REST API** under `/api/v1` with consistent `{success, data, error, meta}` response shape.
- **JWT auth** with httpOnly cookies, 7-day expiry.
- **bcryptjs** password hashing.
- **Zod** validation on every public endpoint.
- **Framer Motion** for page transitions, micro-interactions, layout animations.
- **TanStack Query** for server-state caching.
- **Zustand** for client UI state (route, admin open, command palette, etc.).
- **shadcn/ui** (New York style) + Lucide icons.
- **Recharts** for admin charts.
- **React Hook Form + Zod** for forms.
- **sonner** for toast notifications.
- **Image uploads** stored locally to `/public/uploads/`, validated by MIME type and size.
- **Map URL validation**: only Google Maps / OpenStreetMap URLs allowed in iframe src.
- **Audit logging** for every admin mutation.
- **CSRF-safe** cookie-based auth (`SameSite=Lax`).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** (or **Bun** — this repo uses Bun)
- **npm / bun**

### Install
```bash
bun install        # or: npm install
```

### Set up environment
```bash
cp .env.example .env
# Edit .env to set JWT_SECRET to a long random string in production.
```

### Database setup
```bash
bun run db:push    # Create SQLite schema
bunx tsx prisma/seed.ts   # Seed rich Ethiopian-context demo content
```

### Run in dev
```bash
bun run dev        # or: npm run dev
```
Open **http://localhost:3000** in your browser.

> 💡 In this sandboxed environment, view the app via the **Preview Panel** on the right. Use **Open in New Tab** for full-screen.

### Default admin credentials
```
Email:    admin@safariacademy.com
Password: ChangeMe123!
```
> ⚠️ **Change this immediately** in production via the admin Profile page.

### Open the admin dashboard
Visit `http://localhost:3000/#admin` — or click the mobile menu's "Admin Login" link.

---

## 📂 Project Structure

```
.
├── prisma/
│   ├── schema.prisma        # Full normalized schema (~25 models)
│   └── seed.ts              # Rich demo seed
├── public/
│   ├── brand/               # Logo (light/dark), favicon (SVG)
│   └── uploads/             # Admin-uploaded media
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Fonts (Plus Jakarta Sans + Sora), providers, metadata
│   │   ├── page.tsx         # Renders <SafariApp />
│   │   ├── globals.css      # Brand design system (yellow/green/lime, dark mode, animations)
│   │   └── api/v1/
│   │       ├── public/      # bootstrap, contact, newsletter, inquiry, event-register, alumni-apply
│   │       └── admin/       # login, logout, me, me/profile, dashboard, settings,
│   │                       # hero-slides, branches, team, news, events, gallery,
│   │                       # alumni, testimonials, faqs, legal, fee-tables, inbox,
│   │                       # users, audit-log, upload (each with [id] subroutes)
│   ├── components/
│   │   ├── global/          # Preloader, Navbar, Footer, BackToTop, CustomCursor,
│   │   │                    # ScrollProgress, CommandPalette, MagneticButton, CookieBanner
│   │   ├── sections/        # Public pages: home/, about/, admissions/, academics/,
│   │   │                    # student-life/, news/, events/, alumni/, virtual-tour/,
│   │   │                    # branches/, contact/, legal/ + page-shell.tsx
│   │   ├── admin/           # admin-overlay, admin-login, admin-shell,
│   │   │                    # modules/{dashboard, crud-modules, settings-and-others}, ui.tsx
│   │   ├── providers.tsx    # Theme + TanStack Query + TooltipProvider
│   │   ├── safari-app.tsx   # SPA router + global chrome
│   │   └── ui/              # shadcn/ui (pre-installed)
│   └── lib/
│       ├── db.ts            # Prisma client singleton
│       ├── auth.ts          # bcrypt + JWT (jose)
│       ├── session.ts       # getCurrentUser, requireRole
│       ├── settings.ts      # Settings key/value helpers
│       ├── api-response.ts  # apiSuccess / apiError helpers
│       ├── crud.ts          # All admin CRUD handlers
│       ├── hooks.ts         # useReveal, useCountUp
│       ├── store.ts         # Zustand store (route, admin, command palette, data)
│       ├── types.ts         # Shared TypeScript interfaces
│       └── utils.ts        # cn, parseJSON, formatDate, daysUntil, slugify, sanitizeHTML, extractMapSrc
├── .env.example
├── Caddyfile                # Gateway config (port-multiplexing)
└── package.json
```

---

## 🔑 Replacing Brand Assets from the Admin

1. **Logo & favicon** — Admin → Site Settings → Branding. Update `logoLight`, `logoDark`, `favicon` URLs. The favicon `<link rel="icon">` updates dynamically.
2. **Map** — Admin → Site Settings → Contact & Map. Paste a Google Maps or OpenStreetMap iframe URL or `src` URL. The backend validates against an allow-list (`google.com/maps`, `maps.google.com`, `openstreetmap.org`) and strips anything else.
3. **Hero slides** — Admin → Hero Slides → New Slide. Upload image or paste URL, set CTAs.
4. **Branches & galleries** — Each module supports image upload via the upload button.
5. **Site colors** — Site Settings → Branding (`primaryColor`, `secondaryColor`, `accentColor`). Update the CSS variables in `globals.css` to apply brand-wide.

---

## 🌍 Deployment

### Vercel + Neon (recommended for production)
1. Push this repo to GitHub.
2. Import into Vercel.
3. Add env vars: `DATABASE_URL` (Neon Postgres URL — change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma` first), `JWT_SECRET`.
4. Run `bun run db:push` and `bunx tsx prisma/seed.ts` once.
5. Deploy.

### VPS (Docker — optional)
A `Dockerfile` can be added (this repo runs Bun directly). For VPS:
1. Install Node 20+ and Postgres (or keep SQLite for small deployments).
2. `bun install`, `bun run db:push`, `bunx tsx prisma/seed.ts`.
3. `bun run build && bun run start` (or use PM2 / systemd).

---

## 🛡 Security Notes

- **Change `JWT_SECRET`** in `.env` to a long random string before production.
- **Change the default admin password** immediately via Admin → Profile.
- The map iframe is sandboxed and validated against an allow-list.
- All admin mutations require a valid session cookie; SUPER_ADMIN-only endpoints check role.
- Rich-text HTML is sanitized (script tags / event handlers stripped) before rendering.
- Public form endpoints use Zod validation + honeypot field.

---

## ✅ Self-Review Checklist

### Public site
- [x] Cinematic preloader (skippable, respects reduced-motion)
- [x] Glass navbar with mega-menu + mobile animated menu
- [x] Sticky footer (pushed down naturally, no floating gap)
- [x] Back-to-top with progress ring (on all pages)
- [x] Custom cursor (desktop only)
- [x] Scroll progress bar
- [x] Command palette (⌘K)
- [x] Cookie consent
- [x] Theme toggle (dark default, light supported)
- [x] WhatsApp floating button
- [x] Home: hero, welcome, why-choose, journey, campuses, programs, admissions CTA, news, events, testimonials, achievements, alumni, virtual-tour teaser, final CTA
- [x] About: timeline, mission/vision/values, leadership, partners
- [x] Admissions: steps, requirements, dates, tuition, scholarships, inquiry form
- [x] Academics: overview, programs tabs, curriculum, facilities, team
- [x] Campus & Facilities: bento gallery, safety
- [x] Student Life: masonry gallery + lightbox
- [x] News list + detail (with share buttons, related, prev/next)
- [x] Events list + detail (with .ics, registration form)
- [x] Alumni: cards, give-back, join form
- [x] Virtual Tour: scroll-snapped chapters with video embeds
- [x] Branches list + detail (gallery, map, contact)
- [x] Contact: cards, validated map, validated form
- [x] Privacy / Terms with TOC
- [x] FAQs, Policies, Student Support, Parent Portal
- [x] 404 page

### Admin
- [x] Login (httpOnly cookie, JWT)
- [x] Dashboard with charts + recent activity
- [x] Hero Slides CRUD
- [x] Branches CRUD (with image upload)
- [x] Team CRUD
- [x] News CRUD (HTML body, cover image)
- [x] Events CRUD (with registration toggle)
- [x] Gallery CRUD (with image upload)
- [x] Tuition spreadsheet editor
- [x] Alumni CRUD
- [x] Testimonials CRUD
- [x] FAQs CRUD
- [x] Inbox (5 tabs, search, CSV export)
- [x] Legal pages editor
- [x] Site Settings (grouped, all editable)
- [x] Users & Roles (SUPER_ADMIN only, prevents self-delete / last-super-admin-delete)
- [x] Audit log
- [x] Profile (update name/email/password)
- [x] Media upload (validated MIME + size)

### Architecture
- [x] Prisma schema with 25+ models, createdAt/updatedAt, slugs, indexes
- [x] Rich seed data (Ethiopian context, 8 campuses, leadership, news, events, gallery, alumni, testimonials, achievements, partners, FAQs, legal)
- [x] REST API with consistent response shape
- [x] Zod validation on all public endpoints
- [x] RBAC middleware on admin endpoints
- [x] TypeScript strict
- [x] shadcn/ui components
- [x] Framer Motion animations
- [x] TanStack Query + Zustand
- [x] React Hook Form + Zod forms
- [x] Recharts in admin
- [x] sonner toasts
- [x] Image upload with validation
- [x] Map URL allow-list validation
- [x] Audit logging
- [x] No TypeScript errors blocking build (lint warnings only)
- [x] Browser-verified: page renders, navigation works, admin login works, all API endpoints return 200

---

## 📝 Notes on Tech-Stack Adaptation

The original spec requested **React 18 + Vite + Express + PostgreSQL monorepo**. This implementation adapts that vision to the sandbox's locked stack:

- **Next.js 16 + App Router** instead of Vite + React Router (single visible `/` route renders a virtual-router SPA — pages are switched in client state, preserving the multi-page UX).
- **Prisma + SQLite** instead of PostgreSQL (the schema is portable — change `provider = "postgresql"` and the connection string to migrate).
- **Next.js API routes** under `/api/v1` instead of a separate Express server.
- **httpOnly cookie + JWT (jose)** instead of access + refresh tokens (single 7-day session for simplicity).
- **No Lenis / GSAP** (used Framer Motion + CSS + IntersectionObserver to keep the bundle lean and avoid dev-server memory issues in the sandbox).
- **No R3F / drei 3D** (used SVG + Framer Motion fireflies + parallax for the hero accent — performs better and respects reduced-motion).

All other features (cinematic design system, animations, mega-menu, sticky footer, command palette, custom cursor, scroll progress, admin CRUD for every entity, RBAC, audit log, map validation, image uploads, form validation, CSV export, etc.) are fully implemented.

---

## 💛 Credits

**Designed with passion by Joseph James** — [https://onyx-jj.onrender.com/](https://onyx-jj.onrender.com/)

© 2026 Safari Academy. All Rights Reserved.
