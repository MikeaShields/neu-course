# Meeting Bingo — Implementation Plan

**Based on**: [meeting-bingo-prd.md](../research/meeting-bingo-prd.md)
**Date**: 2026-02-26
**Target**: 90-minute MVP build

---

## Project State

The project scaffold already exists:

- **Build**: Vite 5 + React 18 + TypeScript 5 + Tailwind 3
- **Dependencies**: `canvas-confetti`, `clsx`, `tailwind-merge` already in `package.json`
- **Entry**: `index.html` → `src/main.tsx` (not yet created)
- **Missing**: The entire `src/` directory — no components, hooks, types, or data exist yet

---

## File Structure

```
src/
├── main.tsx                    # ReactDOM.createRoot, App mount
├── App.tsx                     # Top-level router (screen state machine)
├── index.css                   # Tailwind directives + custom CSS vars
│
├── types/
│   └── game.ts                 # BingoGame, BingoCard, BingoSquare, WinningLine, CategoryType
│
├── data/
│   └── categories.ts           # 3 buzzword packs (agile, corporate, tech) — 40+ words each
│
├── hooks/
│   ├── useGameState.ts         # Core game logic: create card, toggle square, check bingo, reset
│   ├── useSpeechRecognition.ts # Web Speech API wrapper: start/stop, transcript, detected words
│   └── useLocalStorage.ts      # Persist/restore game state to localStorage
│
├── lib/
│   ├── cardGenerator.ts        # Fisher-Yates shuffle, pick 24 words, build 5x5 grid
│   ├── bingoChecker.ts         # Check all 12 winning lines (5 rows + 5 cols + 2 diags)
│   └── wordMatcher.ts          # Normalize transcript, regex word-boundary matching
│
├── components/
│   ├── LandingPage.tsx         # Hero, "New Game" CTA, how-it-works section
│   ├── CategorySelection.tsx   # 3 category cards with previews
│   ├── GameBoard.tsx           # Main game screen: header + grid + transcript + controls
│   ├── BingoCard.tsx           # 5x5 grid container
│   ├── BingoSquare.tsx         # Individual square (default/filled/auto-filled/free/winning states)
│   ├── TranscriptPanel.tsx     # Live transcript + detected word chips
│   ├── WinScreen.tsx           # Confetti, winning card, stats, share/play-again buttons
│   └── ui/
│       ├── Button.tsx          # Reusable button with variants
│       └── Toast.tsx           # Auto-dismiss notification for detected words
│
└── assets/
    └── favicon.svg             # Target/bullseye icon
```

---

## Implementation Phases

### Phase 1 — Foundation & Core Game (Steps 1–7)

#### Step 1: Bootstrap `src/` skeleton

Create entry files and verify the dev server runs.

**Files**: `src/main.tsx`, `src/App.tsx`, `src/index.css`

- `main.tsx`: `createRoot(document.getElementById('root')!).render(<App />)`
- `App.tsx`: Render a placeholder `<h1>Meeting Bingo</h1>`
- `index.css`: `@tailwind base; @tailwind components; @tailwind utilities;` + CSS color variables from PRD §6.6
- Run `npm install && npm run dev` to confirm everything compiles

#### Step 2: Types & data

Define the data model and buzzword packs.

**Files**: `src/types/game.ts`, `src/data/categories.ts`

- `game.ts`: Export `BingoGame`, `BingoCard`, `BingoSquare`, `WinningLine`, `CategoryType` interfaces verbatim from PRD §4.1–4.2
- `categories.ts`: Export `CATEGORIES` array with all 3 packs (agile 42 words, corporate 43 words, tech 44 words) from PRD §4.2

#### Step 3: Card generation logic

Pure function, no UI dependency — easy to verify.

**Files**: `src/lib/cardGenerator.ts`

- `generateCard(words: string[]): BingoCard`
- Fisher-Yates shuffle the words array, take first 24
- Place into 5x5 grid, center square `[2][2]` is free space (`isFreeSpace: true`, `isFilled: true`)
- All other squares start `isFilled: false`, `isAutoFilled: false`

#### Step 4: BINGO detection logic

Pure function, testable independently.

**Files**: `src/lib/bingoChecker.ts`

- `checkBingo(card: BingoCard): WinningLine | null`
- Check 5 rows, 5 columns, 2 diagonals (12 lines total)
- Return the first winning line found, or `null`
- Free space always counts toward every line

#### Step 5: Game state hook

Orchestrates card generation, square toggling, and win detection.

**Files**: `src/hooks/useGameState.ts`

- `useGameState()` returns:
  - `game: BingoGame | null`
  - `startGame(category: CategoryType): void` — generates card, sets `startedAt`
  - `toggleSquare(row: number, col: number): void` — flips `isFilled`, re-checks bingo
  - `autoFillSquare(row: number, col: number): void` — sets both `isFilled` and `isAutoFilled`
  - `resetGame(): void`
  - `filledCount: number`
- On each fill, run `checkBingo()` — if winning line found, set `completedAt`, `winningLine`, `winningWord`

#### Step 6: UI components — screens

Build the three main screens and wire navigation via `App.tsx`.

**Files**: `src/App.tsx`, `src/components/LandingPage.tsx`, `src/components/CategorySelection.tsx`, `src/components/GameBoard.tsx`, `src/components/BingoCard.tsx`, `src/components/BingoSquare.tsx`, `src/components/ui/Button.tsx`

- `App.tsx`: State machine with screens `'landing' | 'category' | 'game' | 'win'`
  - `landing` → click "New Game" → `category`
  - `category` → select pack → `game` (calls `startGame(category)`)
  - `game` → bingo detected → `win`
  - `win` → "Play Again" → `category`
- `LandingPage`: Hero section, privacy note, how-it-works (matches PRD §6.2)
- `CategorySelection`: 3 cards with icon, name, description, sample words (matches PRD §6.3)
- `GameBoard`: Header bar (logo, status, progress counter) + `BingoCard` + controls
- `BingoCard`: Maps `game.card.squares` to 5x5 CSS grid of `BingoSquare`
- `BingoSquare`: Handles click → `toggleSquare(row, col)`. Visual states: default, filled (blue), auto-filled (blue + sparkle indicator), free space (yellow), winning (green)
- `Button`: `variant: 'primary' | 'secondary' | 'ghost'`, sizes, disabled state

#### Step 7: Basic win state

Minimal win detection + screen transition.

**Files**: `src/components/WinScreen.tsx` (skeleton)

- When `game.winningLine` is set, `App` transitions to `win` screen
- Show winning card with highlighted line, stats (time elapsed, squares filled, winning word)
- "Play Again" button returns to category selection

---

### Phase 2 — Speech Integration (Steps 8–10)

#### Step 8: Web Speech API hook

Encapsulate browser speech recognition.

**Files**: `src/hooks/useSpeechRecognition.ts`

- `useSpeechRecognition()` returns:
  - `isListening: boolean`
  - `isSupported: boolean`
  - `transcript: string` — latest interim/final result
  - `start(): void` — requests mic permission, begins recognition
  - `stop(): void`
- Configuration: `continuous: true`, `interimResults: true`, `lang: 'en-US'`
- Auto-restart on `onend` event (Web Speech API stops after silence in some browsers)
- Feature detection: check `window.SpeechRecognition || window.webkitSpeechRecognition`
- If unsupported, `isSupported = false` — UI hides mic button, game is manual-only

#### Step 9: Word matching logic

Match transcript text against card words.

**Files**: `src/lib/wordMatcher.ts`

- `findMatchedWords(transcript: string, cardWords: string[]): string[]`
- Normalize: lowercase, trim
- For each unfilled card word, test `\b{word}\b` regex against transcript
- Handle multi-word phrases (e.g., "code review", "story points") — escape regex special chars
- Return array of newly matched words

#### Step 10: Wire speech into game

Connect speech hook to game state.

**Files**: Update `src/components/GameBoard.tsx`, `src/components/TranscriptPanel.tsx`

- `GameBoard` calls `useSpeechRecognition()`
- On each `transcript` change, run `findMatchedWords()` against unfilled squares
- For each match, call `autoFillSquare(row, col)`
- `TranscriptPanel`: Shows last transcript snippet + detected word chips with animation
- Add listening toggle button (start/stop mic)
- Show `Toast` when a word is auto-detected

---

### Phase 3 — Polish (Steps 11–14)

#### Step 11: Win celebration

**Files**: Update `src/components/WinScreen.tsx`

- Fire `canvas-confetti` on mount (burst from both sides)
- Animate "BINGO!" text with CSS scale/fade-in
- Highlight winning line squares in green
- No sound (user is in a meeting)

#### Step 12: Share functionality

**Files**: Update `src/components/WinScreen.tsx`

- "Share" button generates text summary:
  ```
  🎯 Meeting Bingo — BINGO!
  ⏱️ 18 minutes | 📊 12/24 squares
  🏆 Winning word: "Blocker"
  🎮 Category: Agile & Scrum
  Play at: [URL]
  ```
- Use `navigator.clipboard.writeText()` on desktop
- Use `navigator.share()` on mobile (if available), fallback to clipboard
- Show "Copied!" toast confirmation

#### Step 13: localStorage persistence

**Files**: `src/hooks/useLocalStorage.ts`, update `src/hooks/useGameState.ts`

- `useLocalStorage<T>(key: string, initial: T)` — generic hook
- Persist `BingoGame` on every state change
- On app load, restore game if one exists → resume on `game` screen
- "New Game" clears stored state

#### Step 14: Responsive & theme polish

**Files**: Update various components, `src/index.css`

- BingoSquare: scale text down on small screens, ensure tap targets >= 44px
- GameBoard: stack transcript panel below grid on mobile
- CategorySelection: single-column on narrow screens
- Add `favicon.svg` (simple target/bullseye)

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | State machine in `App.tsx` | No need for `react-router` — 4 screens, linear flow |
| State management | `useState` + custom hooks | Simple enough; no Redux/Zustand needed |
| Speech restart | Auto-restart on `onend` | Chrome stops recognition after silence; must restart loop |
| Word matching | Regex word boundaries | Handles exact matches and multi-word phrases |
| Grid layout | CSS Grid `grid-cols-5` | Natural fit for 5x5 bingo card |
| Confetti | `canvas-confetti` | Already in dependencies, lightweight |

---

## Dependency Check

All dependencies are already in `package.json` — no new packages needed:

- `react`, `react-dom` — UI
- `canvas-confetti` — win celebration
- `clsx`, `tailwind-merge` — conditional class names
- `tailwindcss`, `postcss`, `autoprefixer` — styling
- `vite`, `@vitejs/plugin-react` — build
- `typescript` — type safety

Run `npm install` once to install, then `npm run dev` to start.

---

## Out of Scope (per PRD)

- No user accounts or auth
- No backend/database
- No multiplayer sync
- No custom buzzword creation
- No sound effects
- No game history beyond localStorage
- No leaderboards
