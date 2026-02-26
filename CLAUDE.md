# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NEU AI agent learning course. The current project is **Meeting Bingo** — a client-side React app where users play bingo with meeting buzzwords. It supports manual square toggling and optional Web Speech API auto-detection. No backend; all state is in-browser (localStorage).

## Development Commands

```bash
npm run dev          # Start Vite dev server on port 3000
npm run build        # TypeScript check + Vite production build → dist/
npm run preview      # Preview production build locally
npm run typecheck    # TypeScript type checking only (tsc --noEmit)
```

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript 5** (strict mode, noUnusedLocals/Parameters)
- **Tailwind CSS 3** with PostCSS/Autoprefixer
- `canvas-confetti` for win celebrations, `clsx` + `tailwind-merge` for class composition
- No routing library — screen navigation is a state machine in `App.tsx`
- No state management library — `useState` + custom hooks

## Architecture

The app is a single-page client-side React app. Key structure under `src/`:

- **Screen flow**: `App.tsx` manages a state machine: `landing → category → game → win`
- **`types/game.ts`**: Core data model — `BingoGame`, `BingoCard`, `BingoSquare`, `WinningLine`, `CategoryType`
- **`data/categories.ts`**: Three buzzword packs (agile, corporate, tech) with 40+ words each
- **`lib/`**: Pure functions — `cardGenerator.ts` (Fisher-Yates shuffle, 5×5 grid), `bingoChecker.ts` (12 winning lines), `wordMatcher.ts` (regex word-boundary matching)
- **`hooks/`**: `useGameState` (game logic orchestrator), `useSpeechRecognition` (Web Speech API wrapper), `useLocalStorage` (persistence)
- **`components/`**: Screen components (`LandingPage`, `CategorySelection`, `GameBoard`, `WinScreen`) and game components (`BingoCard`, `BingoSquare`, `TranscriptPanel`)

Full implementation plan: `docs/implementation/plan.md`

## Environment Management

This project uses [varlock](https://varlock.dev/env-spec) for environment variable management.

- `.env.schema` defines env vars using the `@env-spec` format
- `env.d.ts` is auto-generated from the schema — do not edit directly
- Use `varlock run -- <command>` to run commands with env vars injected
- `LINEAR_API_KEY` is configured as a sensitive env var for Linear API access

## Tools

- **varlock** v0.2.3 — env variable management; use `varlock run -- <command>` to inject env vars
- **Linear** — project management via GraphQL API (`https://api.linear.app/graphql`), authenticated with `LINEAR_API_KEY`. Use `varlock run -- curl` to make API calls.
- **Vercel** v50.23.2 — deployment and hosting CLI
- **GitHub CLI (gh)** v2.83.1 — issues, PRs, and GitHub API calls
