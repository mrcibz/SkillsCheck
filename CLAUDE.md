# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint (flat config, eslint.config.mjs)
```

Package manager is **pnpm** (lock file: `pnpm-lock.yaml`). Do not use npm or yarn.

## Next.js 16 — Read the Bundled Docs First

This project runs **Next.js 16.2.1** (App Router only). APIs and conventions may differ from training data. Before writing or modifying Next.js code, consult the guides under `node_modules/next/dist/docs/` — especially `01-app/`.

## Architecture

- **100% stateless** — no database, no auth, no persistent storage. All runtime state lives in React (`useState`/`useContext`/Zustand). `localStorage` only for editor preferences.
- **Proxy pattern for external APIs** — API keys stay server-side. Frontend calls Next.js Route Handlers (`app/api/.../route.ts`), which forward requests to external services (Judge0/Piston) using secrets from `.env.local`.
- **Path alias** `@/*` maps to the project root (tsconfig `paths`).

## Stack

- Next.js (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- `@monaco-editor/react` for the code editor
- `react-markdown` for problem statements
- `sonner` or `react-hot-toast` for notifications
- `tailwind-animations` for page/element animations (Tailwind v4 plugin)

## Tailwind Animations

Docs: https://tailwind-animations.com/

Imported in `globals.css` alongside Tailwind:
```css
@import 'tailwindcss';
@import 'tailwind-animations';
```

Use animation classes directly on elements (e.g. `animate-fade-in`, `animate-slide-in-top`, `animate-zoom-in`). Customize with:
- **Duration**: `animate-duration-300`, `animate-duration-500`, `animate-duration-slow`, `animate-duration-fast`
- **Delay**: `animate-delay-100`, `animate-delay-300`
- **Scroll-driven**: `timeline-view`, `timeline-scroll`, `animate-range-*` for viewport-based animations

## UI/UX Conventions

- Dark theme: Slate/Zinc backgrounds, accent blue `#3b82f6`
- Split-pane layout: problem description (left) / editor + console (right)
- **Fully responsive**: all interfaces must adapt to mobile, tablet, and desktop. Use Tailwind breakpoints (`sm`, `md`, `lg`, `xl`) consistently.
- **Language**: all UI text, copy, and content must be in English.

## User Flow

1. User picks difficulty → frontend fetches a random problem via API
2. User writes solution in Monaco Editor
3. "Run" sends code + test cases to `/api/execute` → backend proxies to Judge0/Piston
4. UI shows Accepted / Wrong Answer / Error
