# Project Memory: design.angelaliu.com

## Workflow preferences
- **Always commit after a series of work** — but do NOT push to GitHub until user explicitly says so

## Project overview
Experimental portfolio for Angela Liu (design.angelaliu.com). Multiple radical "themes" each completely reimagine the UI. Content is decoupled in `src/content/portfolio.ts`.

## Tech stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS (utility layer)
- Framer Motion (theme transitions)
- Anthropic SDK (IDE theme chat)
- Deployed to Vercel

## Themes
- **DOS** (`src/themes/dos/`) — default. CRT terminal, boot sequence, PxPlus IBM VGA8 font, sound effects, draggable DosWindow media popups
- **IDE** (`src/themes/ide/`) — light mode, VS Code-inspired 3-panel layout (file tree + content + AI chat). Chat powered by claude-haiku-4-5 via `/api/chat`
- **Learn** (`src/themes/learn/`) — editorial reading experience. Free text selection → floating "✦ Explore this" bubble → AI context card in sliding side panel. Per-card Q&A (follow-up questions stream in). Onboarding animation: fake cursor glides to target text, highlights it, panel opens with hardcoded card. API: `/api/learn` (streaming SSE). Bio text in `data/bio.ts`. Onboarding seen flag in localStorage (`learn-onboarding-done`).

## Key files
- `src/content/portfolio.ts` — single source of truth for all portfolio data
- `src/themes/index.ts` — theme registry, defaultThemeId = "dos"
- `src/themes/types.ts` — ThemeDefinition interface (requires `data: PortfolioData` prop)
- `src/themes/ThemeProvider.tsx` — theme state, localStorage persistence, transitions
- `src/app/api/chat/route.ts` — streaming Anthropic SSE route (lazy client init, error handling)
- `src/app/api/learn/route.ts` — Learn theme context/Q&A endpoint; takes `{selectedText, question?, history?}`
- `.env.local` — ANTHROPIC_API_KEY (do not commit)

## Architecture notes
- Each theme is a `ThemeDefinition` with `PageComponent: ComponentType<{ data: PortfolioData }>`
- Themes code-split via `next/dynamic` with `ssr: false`
- Theme transitions: "glitch" (DOS exit) or "dissolve" (IDE enter)
- `.env.local` is gitignored — never commit it

## IDE theme design tokens
All in CSS custom properties on `.ide-theme`. Light mode: white bg, #f5f5f5 sidebar, #0066cc accent. Type scale: 11px chrome / 12px UI / 13px chat / 14px prose.
