# New Bingo Categories — Implementation Plan

**Date**: 2026-02-27
**Linear Issues**: [TES-20](https://linear.app/test987998899/issue/TES-20) (Traffic), [TES-21](https://linear.app/test987998899/issue/TES-21) (Kids), [TES-22](https://linear.app/test987998899/issue/TES-22) (Hockey)

---

## Overview

Add three new buzzword categories — **Traffic**, **Kids**, and **Hockey** — following the same pattern as the existing agile, corporate, and tech categories.

## Files to Modify

| File | Change |
|------|--------|
| `src/types/game.ts` | Extend `CategoryType` union with `'traffic' \| 'kids' \| 'hockey'` |
| `src/data/categories.ts` | Add 3 new `BuzzwordCategory` entries (40+ words each) |

No other files require changes — the app dynamically renders categories from the `CATEGORIES` array.

---

## Step 1: Update CategoryType

**File**: `src/types/game.ts:1`

```diff
- export type CategoryType = 'agile' | 'corporate' | 'tech';
+ export type CategoryType = 'agile' | 'corporate' | 'tech' | 'traffic' | 'kids' | 'hockey';
```

## Step 2: Add Traffic Category

**File**: `src/data/categories.ts`

```ts
{
  id: 'traffic',
  name: 'Traffic & Commute',
  description: 'Road rage, detours, and bumper-to-bumper jams',
  icon: '🚗',
  words: [
    'bumper to bumper', 'road rage', 'detour', 'fender bender', 'rubbernecking',
    'gridlock', 'rush hour', 'tailgating', 'merge', 'yield',
    'pothole', 'speed trap', 'construction zone', 'lane closure', 'bottleneck',
    'carpool', 'HOV lane', 'off-ramp', 'on-ramp', 'interchange',
    'traffic jam', 'red light', 'green light', 'U-turn', 'roundabout',
    'jaywalker', 'crosswalk', 'speed limit', 'shoulder', 'median',
    'blind spot', 'right of way', 'horn', 'brake check', 'cut off',
    'parallel parking', 'double parked', 'toll booth', 'GPS', 'ETA',
    'alternate route', 'back road', 'school zone', 'pedestrian',
  ],
},
```

## Step 3: Add Kids Category

**File**: `src/data/categories.ts`

```ts
{
  id: 'kids',
  name: 'Kids & Parenting',
  description: 'Tantrums, snack time, and are we there yet',
  icon: '👶',
  words: [
    'tantrum', 'snack time', 'nap time', 'bedtime', 'timeout',
    'are we there yet', 'playground', 'playdate', 'screen time', 'homework',
    'lunchbox', 'car seat', 'diaper', 'pacifier', 'stroller',
    'picky eater', 'sugar rush', 'inside voice', 'sharing is caring', 'because I said so',
    'five more minutes', 'show and tell', 'recess', 'field trip', 'report card',
    'sleepover', 'birthday party', 'tooth fairy', 'booster seat', 'baby proof',
    'sippy cup', 'coloring book', 'arts and crafts', 'juice box', 'goldfish crackers',
    'cartoon', 'bedtime story', 'night light', 'imaginary friend', 'growing pains',
    'first day of school', 'parent teacher conference', 'carpool line', 'sibling rivalry',
  ],
},
```

## Step 4: Add Hockey Category

**File**: `src/data/categories.ts`

```ts
{
  id: 'hockey',
  name: 'Hockey',
  description: 'Hat tricks, power plays, and dropping the gloves',
  icon: '🏒',
  words: [
    'hat trick', 'power play', 'penalty box', 'face-off', 'icing',
    'offside', 'slap shot', 'wrist shot', 'breakaway', 'one-timer',
    'top shelf', 'five hole', 'deke', 'dangle', 'snipe',
    'bar down', 'empty net', 'pull the goalie', 'overtime', 'shootout',
    'blue line', 'red line', 'crease', 'boards', 'glass',
    'checking', 'cross-check', 'hooking', 'tripping', 'high-sticking',
    'enforcer', 'goon', 'assist', 'Gordie Howe hat trick', 'Zamboni',
    'puck drop', 'power forward', 'stay-at-home defenseman', 'neutral zone', 'forecheck',
    'backcheck', 'dump and chase', 'odd-man rush', 'line change',
  ],
},
```

---

## Verification

After implementation, verify:

1. `npm run typecheck` — no type errors from the new CategoryType values
2. `npm run build` — production build succeeds
3. `npm run dev` — all 6 categories appear on the CategorySelection screen
4. Each new category generates a valid 5x5 bingo card
5. Speech recognition matches words from new categories

## Estimated Scope

- **Files changed**: 2
- **Lines added**: ~60
- **Risk**: Low — additive change only, no existing behavior modified
- **Dependencies**: None — no new packages required
