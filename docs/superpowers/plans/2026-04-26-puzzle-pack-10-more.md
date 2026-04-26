# Puzzle Pack: 10 More Puzzles (Phase 5.1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 10 additional curated puzzles (demo-2…demo-11) with mixed layouts and mixed piece counts, using 90° step target rotations, and expose them in the existing puzzle picker.

**Architecture:** Introduce a small data-driven builder that converts a plain spec into `PuzzleState`. Define puzzle specs in one module and register them in the catalog. Add localized titles for each new puzzle in all locales.

**Tech Stack:** TypeScript, Next.js App Router, next-intl.

---

## Files / Modules

Create:
- `apps/web/src/lib/puzzles/builder.ts`
- `apps/web/src/lib/puzzles/pack-1.ts`

Modify:
- `apps/web/src/lib/puzzles/catalog.ts`
- `apps/web/src/i18n/messages/en.json`
- `apps/web/src/i18n/messages/es.json`
- `apps/web/src/i18n/messages/zh-CN.json`
- `apps/web/src/i18n/messages/ja.json`
- `apps/web/src/i18n/messages/ko.json`

---

### Task 1: Create a reusable PuzzleState builder

**Files:**
- Create: `apps/web/src/lib/puzzles/builder.ts`

- [ ] **Step 1: Create builder.ts**

Create `apps/web/src/lib/puzzles/builder.ts`:

```ts
import { type Piece, type PuzzleState, type SnapConfig } from "@/lib/puzzle/state"
import { type Vec2 } from "@/lib/puzzle/vec2"

export type RectPieceSpec = {
  id: string
  size: { w: number; h: number }
  startPos: Vec2
  startRotation: number
  targetPos: Vec2
  targetRotation: number
}

export type PuzzleSpec = {
  board: { width: number; height: number }
  snap: SnapConfig
  pieces: RectPieceSpec[]
}

export function buildPuzzleState(spec: PuzzleSpec): PuzzleState {
  const pieces: Piece[] = spec.pieces.map((p, i) => ({
    id: p.id,
    pos: { ...p.startPos },
    rotation: p.startRotation,
    targetPos: { ...p.targetPos },
    targetRotation: p.targetRotation,
    locked: false,
    z: i + 1,
    shape: { w: p.size.w, h: p.size.h }
  }))

  return {
    board: { ...spec.board },
    pieces,
    activePieceId: null,
    snap: { ...spec.snap }
  }
}
```

---

### Task 2: Add pack-1 puzzle specs and factories (10 puzzles)

**Files:**
- Create: `apps/web/src/lib/puzzles/pack-1.ts`

- [ ] **Step 1: Create pack-1.ts**

Create `apps/web/src/lib/puzzles/pack-1.ts` with 10 exported factories:
- `createDemo2PuzzleState` … `createDemo11PuzzleState`

Implementation notes:
- Use `buildPuzzleState()`
- Use board `{width: 800, height: 500}`
- Use 90° rotations: `0`, `Math.PI / 2`, `Math.PI`, `(3 * Math.PI) / 2`
- Balanced counts across 10 puzzles:
  - 3 puzzles: 6 pieces
  - 3 puzzles: 8 pieces
  - 2 puzzles: 10 pieces
  - 2 puzzles: 12 pieces
- Snap tightening for larger puzzles:
  - 6 pcs: `{ distancePx: 18, angleRad: 0.25 }`
  - 8 pcs: `{ distancePx: 16, angleRad: 0.22 }`
  - 10 pcs: `{ distancePx: 14, angleRad: 0.20 }`
  - 12 pcs: `{ distancePx: 12, angleRad: 0.18 }`

The file should look like this skeleton (fill the pieces arrays fully for each puzzle):

```ts
import { vec } from "@/lib/puzzle/vec2"
import { buildPuzzleState, type PuzzleSpec } from "@/lib/puzzles/builder"

const board = { width: 800, height: 500 }
const R0 = 0
const R90 = Math.PI / 2
const R180 = Math.PI
const R270 = (3 * Math.PI) / 2

function make(spec: Omit<PuzzleSpec, "board">): PuzzleSpec {
  return { ...spec, board }
}

export function createDemo2PuzzleState() {
  return buildPuzzleState(
    make({
      snap: { distancePx: 18, angleRad: 0.25 },
      pieces: [
        {
          id: "p1",
          size: { w: 140, h: 80 },
          startPos: vec(120, 380),
          startRotation: 0.7,
          targetPos: vec(220, 140),
          targetRotation: R90
        }
      ]
    })
  )
}
```

---

### Task 3: Register the 10 new puzzles in the catalog

**Files:**
- Modify: `apps/web/src/lib/puzzles/catalog.ts`

- [ ] **Step 1: Update catalog.ts**

Update `apps/web/src/lib/puzzles/catalog.ts` to:
- import the new factories from `pack-1.ts`
- add entries for:
  - `demo-2` -> `titleKey: "demo2.title"`
  - …
  - `demo-11` -> `titleKey: "demo11.title"`

---

### Task 4: Add puzzle titles to all locales

**Files:**
- Modify: `apps/web/src/i18n/messages/en.json`
- Modify: `apps/web/src/i18n/messages/es.json`
- Modify: `apps/web/src/i18n/messages/zh-CN.json`
- Modify: `apps/web/src/i18n/messages/ja.json`
- Modify: `apps/web/src/i18n/messages/ko.json`

- [ ] **Step 1: Add keys demo2…demo11**

Add `puzzles.demo2.title` … `puzzles.demo11.title`.

Keep it simple and consistent (recommended):
- English: “Demo Puzzle 2”, … “Demo Puzzle 11”
- Spanish: “Puzzle de Demostración 2”, …
- Chinese: “演示拼图 2”, …
- Japanese: “デモパズル 2”, …
- Korean: “데모 퍼즐 2”, …

---

### Task 5: Verification

- [ ] **Step 1: Format + lint + typecheck**

Run:

```bash
cd /workspace/apps/web
npm run format:check
npm run lint
npm run typecheck
```

- [ ] **Step 2: Manual**

Run:

```bash
cd /workspace/apps/web
npm run dev
```

Manual:
- Visit `/en/play` and confirm 11 puzzles are listed
- Open `/en/play/demo-2` and confirm it loads
- Spot check a 12-piece puzzle (e.g. `/en/play/demo-11`) loads and requires 90° rotation for snap

