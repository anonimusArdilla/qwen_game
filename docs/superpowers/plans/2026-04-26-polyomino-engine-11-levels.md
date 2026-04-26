# Polyomino Engine + 11 “Real” Packing Levels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the puzzle engine to support polyomino/compound shapes and replace all 11 current puzzle levels with polyomino-style packing puzzles.

**Architecture:** Introduce a `PieceShape` union (`rect` | `compound`) and update the canvas renderer + hit-testing to operate on lists of local rectangles. Extend puzzle builder/specs to define polyomino shapes from grid-cells and author 11 new level specs using those shapes.

**Tech Stack:** Next.js, TypeScript, Canvas 2D.

---

## File Structure

Modify:
- `apps/web/src/lib/puzzle/state.ts` (shape model)
- `apps/web/src/lib/puzzles/builder.ts` (spec/build supports shapes)
- `apps/web/src/lib/puzzle/geom.ts` (add local-rect helpers if needed)
- `apps/web/src/components/PuzzleCanvas.tsx` (render + hit-test compound shapes)
- `apps/web/scripts/puzzle-smoke.ts` (validate shape data)
- `apps/web/src/lib/puzzle/demo.ts` (replace with polyomino starter, or remove if unused)
- `apps/web/src/lib/puzzles/pack-1.ts` (replace 11 level definitions)

Create:
- `apps/web/src/lib/puzzle/shapes.ts` (shape helpers: rectShape, polyominoShape, toLocalRects)
- `apps/web/src/lib/puzzles/pack-2.ts` (optional: if pack-1 grows too large; only if needed)

---

### Task 1: Add PieceShape model + helpers

**Files:**
- Modify: `apps/web/src/lib/puzzle/state.ts`
- Create: `apps/web/src/lib/puzzle/shapes.ts`

- [ ] **Step 1: Write failing smoke test for compound shapes**

Edit `apps/web/scripts/puzzle-smoke.ts` to assert every piece has at least one rect in `toLocalRects(shape)`:

```ts
import { toLocalRects } from "../src/lib/puzzle/shapes"

for (const puzzle of puzzles) {
  const state = puzzle.createInitialState()
  for (const piece of state.pieces) {
    const rects = toLocalRects(piece.shape)
    if (rects.length === 0) throw new Error(`no rects: ${puzzle.id}:${piece.id}`)
    for (const r of rects) {
      if (!(r.w > 0 && r.h > 0)) throw new Error(`invalid rect: ${puzzle.id}:${piece.id}`)
    }
  }
}
```

- [ ] **Step 2: Run smoke to see it fail (shape typing not yet added)**

Run:

```bash
cd /workspace/apps/web
npm run puzzle:smoke
```

Expected: FAIL (imports/types missing).

- [ ] **Step 3: Implement PieceShape in state.ts**

In `apps/web/src/lib/puzzle/state.ts`, replace `PieceRect` with:

```ts
export type PieceRectLocal = { x: number; y: number; w: number; h: number }

export type PieceShape =
  | { kind: "rect"; w: number; h: number }
  | { kind: "compound"; rects: PieceRectLocal[] }
```

Update `Piece`:

```ts
shape: PieceShape
```

- [ ] **Step 4: Implement shapes.ts helpers**

Create `apps/web/src/lib/puzzle/shapes.ts`:

```ts
import { type PieceRectLocal, type PieceShape } from "@/lib/puzzle/state"

export function rectShape(w: number, h: number): PieceShape {
  return { kind: "rect", w, h }
}

export function toLocalRects(shape: PieceShape): PieceRectLocal[] {
  if (shape.kind === "rect") {
    return [{ x: -shape.w / 2, y: -shape.h / 2, w: shape.w, h: shape.h }]
  }
  return shape.rects
}

export type Cell = { x: number; y: number }

export function polyominoShape(cells: readonly Cell[], cellSize: number): PieceShape {
  const rects = cells.map((c) => ({
    x: c.x * cellSize,
    y: c.y * cellSize,
    w: cellSize,
    h: cellSize
  }))

  const minX = Math.min(...rects.map((r) => r.x))
  const minY = Math.min(...rects.map((r) => r.y))
  const maxX = Math.max(...rects.map((r) => r.x + r.w))
  const maxY = Math.max(...rects.map((r) => r.y + r.h))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  const centered = rects.map((r) => ({ ...r, x: r.x - cx, y: r.y - cy }))
  return { kind: "compound", rects: centered }
}
```

- [ ] **Step 5: Run lint/typecheck/smoke**

Run:

```bash
cd /workspace/apps/web
npm run lint
npm run typecheck
npm run puzzle:smoke
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd /workspace
git add apps/web/src/lib/puzzle/state.ts apps/web/src/lib/puzzle/shapes.ts apps/web/scripts/puzzle-smoke.ts
git commit -m "feat(puzzle): add compound piece shapes"
```

---

### Task 2: Update builder/spec to support shapes

**Files:**
- Modify: `apps/web/src/lib/puzzles/builder.ts`
- Modify: `apps/web/src/lib/puzzle/demo.ts` (if kept)

- [ ] **Step 1: Write failing unit-like check in smoke for builder mapping**

Extend smoke to ensure `buildPuzzleState` copies shape data:

```ts
if (piece.shape.kind === "compound" && toLocalRects(piece.shape).length < 2) {
  throw new Error(`compound too small: ${puzzle.id}:${piece.id}`)
}
```

- [ ] **Step 2: Update RectPieceSpec to PieceSpec with shape**

In `builder.ts`:

```ts
import { type PieceShape } from "@/lib/puzzle/state"

export type PieceSpec = {
  id: string
  shape: PieceShape
  startPos: Vec2
  startRotation: number
  targetPos: Vec2
  targetRotation: number
}

export type PuzzleSpec = {
  board: { width: number; height: number }
  snap: SnapConfig
  pieces: PieceSpec[]
}
```

Update mapping:

```ts
shape: p.shape
```

- [ ] **Step 3: Update any callers using size → shape**

Update `demo.ts` and `pack-1.ts` (temporarily) so TypeScript compiles:
Replace:

```ts
size: { w: 140, h: 80 }
```

with:

```ts
shape: rectShape(140, 80)
```

- [ ] **Step 4: Run lint/typecheck/smoke**

```bash
cd /workspace/apps/web
npm run lint
npm run typecheck
npm run puzzle:smoke
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /workspace
git add apps/web/src/lib/puzzles/builder.ts apps/web/src/lib/puzzle/demo.ts apps/web/src/lib/puzzles/pack-1.ts apps/web/scripts/puzzle-smoke.ts
git commit -m "feat(puzzles): support shaped pieces in builder"
```

---

### Task 3: Render compound shapes in PuzzleCanvas

**Files:**
- Modify: `apps/web/src/components/PuzzleCanvas.tsx`

- [ ] **Step 1: Update drawTarget and drawPiece to iterate local rects**

Import:

```ts
import { toLocalRects } from "@/lib/puzzle/shapes"
```

Replace any use of `piece.shape.w/h` with:

```ts
const rects = toLocalRects(piece.shape)
for (const r of rects) {
  roundRectPath(ctx, r.x, r.y, r.w, r.h, 10)
}
```

Ensure you `ctx.beginPath()` once and add all sub-rects before fill/stroke, or per-rect, but keep visuals consistent.

- [ ] **Step 2: Update hit-testing**

Replace `hitTestOrientedRect` usage with:
- Convert pointer to piece-local coordinates
- Simple axis-aligned rect checks against `toLocalRects(piece.shape)`

Minimal check:

```ts
function pointInRect(pt: Vec2, r: {x:number;y:number;w:number;h:number}) {
  return pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h
}
```

- [ ] **Step 3: Manual verification**

Run dev server and open a puzzle:

```bash
cd /workspace/apps/web
npm run dev -- --port 3000
```

Ensure:
- pieces show multi-block silhouettes
- dragging selects correct piece by shape (not bounding box)

- [ ] **Step 4: Commit**

```bash
cd /workspace
git add apps/web/src/components/PuzzleCanvas.tsx
git commit -m "feat(ui): render and hit-test compound puzzle pieces"
```

---

### Task 4: Author 11 polyomino packing levels

**Files:**
- Modify: `apps/web/src/lib/puzzles/pack-1.ts` (or split into pack-2.ts)

- [ ] **Step 1: Choose a single cellSize**

Use:
- `cellSize = 50` px for board 800×500 (fits 16×10 grid).

- [ ] **Step 2: Define a reusable polyomino set**

In `pack-1.ts`, define piece shapes using `polyominoShape`:

Example (tetromino-like):

```ts
const cell = 50
const P1 = polyominoShape([{x:0,y:0},{x:1,y:0},{x:0,y:1}], cell) // L3
```

- [ ] **Step 3: For each puzzleId, define target arrangement**

For each of the 11 puzzles:
- assign unique shapes (6/8/10/12 pieces)
- compute target positions on grid so pieces tile a cavity region (visual)
- set target rotations to 0/90/180/270 where appropriate
- choose scrambled start positions around perimeter

Checklist per puzzle:
- Each piece’s target does not overlap visually in the solved layout
- All targets remain within board bounds
- Start positions are outside the cavity region

- [ ] **Step 4: Run smoke**

```bash
cd /workspace/apps/web
npm run puzzle:smoke
```

- [ ] **Step 5: Manual playtest 3 representative levels**

Play:
- `starter-six` (6 pieces)
- `stack-eight` (8 pieces)
- `dense-twelve-b` (12 pieces)

- [ ] **Step 6: Commit**

```bash
cd /workspace
git add apps/web/src/lib/puzzles/pack-1.ts
git commit -m "feat(levels): replace pack-1 with polyomino puzzles"
```

---

### Task 5: End-to-end verification + PR

**Files:**
- (none required; verification + PR)

- [ ] **Step 1: Build**

```bash
cd /workspace/apps/web
npm run build
```

Expected: PASS.

- [ ] **Step 2: Start and spot-check**

```bash
cd /workspace/apps/web
npm run start -- --port 3000
```

Open:
- `/en/play`
- `/en/play/starter-six`

- [ ] **Step 3: Push branch + open PR**

Push and open a PR to `anonimusArdilla/qwen_game`.

