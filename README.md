# Qarabag MecHack Website

<p align="center">
  <img src="/public/logo/logo.jpg" alt="Qarabag MecHack Logo" width="160" height="160" />
</p>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwindcss&logoColor=white" /></a>
  <a href="https://www.framer.com/motion/" target="_blank"><img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-11-0055FF?logo=framer" /></a>
  <a href="https://supabase.com/" target="_blank"><img alt="Supabase" src="https://img.shields.io/badge/Supabase-Edge%20/%20SSR-3ECF8E?logo=supabase&logoColor=white" /></a>
  <a href="https://next-intl-docs.vercel.app/" target="_blank"><img alt="next-intl" src="https://img.shields.io/badge/next--intl-4-000000" /></a>
</p>

> A modern, multilingual website for Qarabag MecHack robotics team. It blends performance, accessibility, and delightful motion design with a robust content workflow backed by Supabase.


## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Internationalization (i18n)](#internationalization-i18n)
- [Data & Supabase](#data--supabase)
- [Styling & Design System](#styling--design-system)
- [Animations](#animations)
- [Quality & Tooling](#quality--tooling)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)


## Overview
Qarabag MecHack Website is built with Next.js App Router and TypeScript. It supports English, Azerbaijani and Russian, uses Supabase for content and media, and delivers a premium user experience with subtle motion and polished UI components.

- Multilingual content routing (`/[locale]/*`)
- Server-first data (static/SSR) with Supabase
- Admin experiences under `/[locale]/admin/*`
- Optimized images, responsive layout, and accessible UI


## Features
- UX & Content
  - Multilingual pages (EN, AZ, RU) and locale-aware routing
  - News, events, projects and media library integrations
  - Responsive, mobile-first layout with shadcn/ui components
  - SEO-friendly structure, clean URLs and metadata
- Engineering
  - Type-safe codebase with TS
  - App Router (streaming, layouts, server actions ready)
  - Next middleware for locale and Supabase session refresh
  - Static generation with per-locale params


## Architecture
- App Router: `website/app` with `/[locale]` segment for localized routes
- i18n via `next-intl` (middleware + request-time message loading)
- Supabase clients:
  - Static server client: `lib/supabase/static.ts`
  - Browser client for client-side interactions: `lib/supabase/client.ts`
- Middleware integrates `next-intl` and refreshes Supabase auth cookies per request


## Tech Stack
- Framework: Next.js 15, React 19, TypeScript 5
- UI: Tailwind CSS 4, shadcn/ui, Radix Primitives
- Motion: Framer Motion
- Data: Supabase (Postgres + Storage)
- i18n: next-intl 4


## Getting Started
1) Requirements
- Node.js 20 LTS (recommended) or >=18.17
- npm 9+ (or pnpm/yarn/bun)

2) Install
```bash
cd website
npm install
```

3) Configure environment
Create `website/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4) Run
```bash
npm run dev
# open http://localhost:3000
```

5) Build & start
```bash
npm run build
npm start
```


## Environment Variables
The website uses only public Supabase keys on the client side. Put the following into `website/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Optional:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
> Do not expose service role keys in the frontend.


## Project Structure
```
website/
├─ app/
│  ├─ [locale]/
│  │  ├─ admin/              # Admin interfaces
│  │  ├─ news/               # News listing & details
│  │  ├─ events/             # Events
│  │  ├─ projects-events/    # Projects/Events hub
│  │  ├─ layout.tsx          # Locale layout
│  │  ├─ page.tsx            # Home (per-locale)
│  │  └─ HomeClient.tsx      # Home client UI
│  ├─ api/                   # Route handlers
│  ├─ favicon.ico
│  ├─ globals.css
│  └─ layout.tsx             # Root layout
├─ components/
│  ├─ admin/                 # Admin UI pieces
│  ├─ shared/                # Shared feature components
│  └─ ui/                    # shadcn/ui
├─ i18n/
│  └─ request.ts             # i18n loader
├─ lib/
│  └─ supabase/              # Supabase clients
├─ messages/                 # i18n translation files (en/az/ru)
├─ public/                   # Static assets (logo, news, sponsors, video)
├─ middleware.ts             # next-intl + Supabase cookies refresh
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ tsconfig.json
└─ README.md
```


## Internationalization (i18n)
- Locales: `en`, `az`, `ru`
- Middleware enforces locale prefix (`/en`, `/az`, `/ru`)
- Messages are loaded in `i18n/request.ts` from `messages/<lng>.json`

Add a new language:
1. Create `messages/<lng>.json`
2. Add the locale to `middleware.ts` locales array
3. Provide translations for required namespaces/keys


## Data & Supabase
- Server/static fetches use `getSupabaseStaticClient()` from `lib/supabase/static.ts`
- Client interactions use `getSupabaseBrowserClient()` in `lib/supabase/client.ts`
- Auth cookies are refreshed in `middleware.ts`

Schema
- See `website/supabase.sql` for SQL helpers/tables (import via Supabase SQL Editor)
- Common tables: `news`, `events`, `projects` (+ localized variants like `news_az`)

Content rules
- Visibility is controlled by `published_at` (filtering/sorting)
- Displayed date for news is `created_at`


## Styling & Design System
- Tailwind CSS 4 with CSS variables for brand colors (see `app/globals.css`)
- shadcn/ui + Radix primitives for accessible UI
- Consistent spacing, rounded corners, and elevation tokens

Theming
- Brand palette is defined via CSS variables
- Image domains are configured in `next.config.ts`


## Animations
- Framer Motion is used for subtle page and component transitions
- Keep animations performant: avoid heavy layouts, prefer transform/opacity
- Respect users with reduced motion preferences where applicable


## Quality & Tooling
Scripts
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

Conventions
- TypeScript-first; avoid `any` unless necessary
- Small, focused components; prefer composition
- Early returns, clear naming, minimal nesting
- Accessibility: label interactive elements and ensure keyboard support


## Deployment
Vercel (recommended)
1. Push to your repository
2. Import project on Vercel
3. Add environment variables
4. Deploy

Manual
```bash
npm run build
npm start
```


## Troubleshooting
- Blank images: ensure the image host is whitelisted in `next.config.ts`
- i18n 404: verify locale prefixes and `middleware.ts` configuration
- Supabase auth state not persisting: check cookies; middleware must run on page routes
- Env vars not loading: confirm `.env.local` exists under `website/` and values are set


## License
MIT © Qarabag MecHack
