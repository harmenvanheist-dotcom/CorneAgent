# Repository Guidelines

## Project Structure & Module Organization
- `app/` — Next.js App Router UI (`page.tsx`, `layout.tsx`, global styles in `app/globals.css`).
- `app/api/create-session/route.ts` — Edge runtime API that creates ChatKit sessions.
- `components/` — Reusable React components (e.g., `ChatKitPanel.tsx`, `ErrorOverlay.tsx`).
- `hooks/` — React hooks (e.g., `useColorScheme.ts`).
- `lib/` — App config and helpers (e.g., `lib/config.ts`).
- `public/` — Static assets (SVGs, icons).
- Config: `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands
- `npm install` — Install dependencies.
- `npm run dev` — Start the Next.js dev server on `http://localhost:3000`.
- `npm run build` — Production build.
- `npm start` — Run the production build.
- `npm run lint` — Lint sources using ESLint.
  Note: `pnpm` is supported (a lockfile exists), but examples use `npm`.

## Coding Style & Naming Conventions
- Language: TypeScript (strict) + React + Next.js 15 App Router.
- Linting: ESLint extends `next/core-web-vitals` and `next/typescript`.
- CSS: Tailwind CSS v4 via PostCSS; prefer utility classes in components.
- Indentation: 2 spaces; avoid trailing semicolons inconsistently (follow formatter).
- Naming: Components `PascalCase` (`ChatKitPanel.tsx`); hooks `useX` (`useColorScheme.ts`); variables/functions `camelCase`.
- Imports: Use alias `@/*` (see `tsconfig.json`), e.g., `import { WORKFLOW_ID } from "@/lib/config"`.

## Testing Guidelines
- This repo currently has no test suite/script. If adding tests:
  - Frameworks: React Testing Library + Vitest/Jest; E2E: Playwright.
  - Location: `__tests__/` or co-located `*.test.ts(x)` next to code.
  - Aim for critical-path coverage (API route and `ChatKitPanel`).
  - Add `"test"` script (e.g., `vitest`) before introducing CI gates.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (`feat:`, `fix:`, `chore:`). Reference issues (`fix: #123`) when applicable.
- PRs must include:
  - Clear summary, motivation, and scope.
  - Screenshots/GIFs for UI changes.
  - Steps to test locally and any migration notes.
  - Linked issues and checklist (lint passes; builds locally).

## Security & Configuration Tips
- Secrets: Never commit `.env.local`. Copy from `.env.example` and update it when introducing new keys.
- Required env: `OPENAI_API_KEY`, `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`; optional `CHATKIT_API_BASE`.
- The session API sets `chatkit_session_id` cookie; avoid logging secrets; validate inputs.

## Spec Kit Overview

The **Spec Kit** is a specification-driven development (SDD) methodology that uses AI to generate code from structured specifications. Main commands:

- **`/speckit.specify`**: Transforms simple descriptions into complete structured specifications
- **`/speckit.plan`**: Generates detailed technical implementation plans with architectural decisions
- **`/speckit.tasks`**: Converts plans into executable task lists

Reduces documentation cycle from ~12 hours to ~15 minutes through structured templates and immutable architectural principles. Reference: [Spec Kit](https://github.com/github/spec-kit/blob/main/spec-driven.md)
