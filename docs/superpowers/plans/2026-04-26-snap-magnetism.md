# Snap Feel: Magnetism (Phase 6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gentle “magnetism” while dragging pieces so they are softly pulled toward their target position when close and reasonably aligned, without changing the existing snap-on-release locking behavior.

**Architecture:** Extend `SnapConfig` to include magnet settings. Add small math utilities (`clamp01`, `lerp`, `smoothstep`) in `geom.ts`. Apply magnet adjustment during the translate-drag branch in `PuzzleCanvas` only (not during Alt-rotation). Keep snap/lock logic unchanged on pointer-up.

**Tech Stack:** TypeScript, React, Canvas 2D.

---

## Files / Modules

Modify:
- `apps/web/src/lib/puzzle/state.ts`
- `apps/web/src/lib/puzzle/geom.ts`
- `apps/web/src/components/PuzzleCanvas.tsx`
- `apps/web/src/lib/puzzle/demo.ts`
- `apps/web/src/lib/puzzles/pack-1.ts`

---

### Task 1: Extend SnapConfig with magnet settings

**Files:**
- Modify: `apps/web/src/lib/puzzle/state.ts`

- [ ] **Step 1: Update SnapConfig type**

Change `SnapConfig` to:

```ts
export type SnapConfig = {
  distancePx: number
  angleRad: number
  magnetDistancePx: number
  magnetAngleRad: number
  magnetStrength: number
}
```

Notes:
- `magnetStrength` should be in `(0..1)`; recommended defaults 0.2–0.35.

- [ ] **Step 2: Run typecheck to confirm expected errors**

Run:

```bash
cd /workspace/apps/web
npm run typecheck
```

Expected: FAIL due to missing new fields in puzzle states.

---

### Task 2: Add lerp/smoothstep helpers

**Files:**
- Modify: `apps/web/src/lib/puzzle/geom.ts`

- [ ] **Step 1: Add helpers**

Append to `geom.ts`:

```ts
export function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function smoothstep(t: number): number {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}
```

- [ ] **Step 2: Run typecheck**

Run:

```bash
cd /workspace/apps/web
npm run typecheck
```

Expected: still FAIL (puzzle states not updated yet), but no new errors from `geom.ts`.

---

### Task 3: Apply magnetism during drag movement

**Files:**
- Modify: `apps/web/src/components/PuzzleCanvas.tsx`

- [ ] **Step 1: Import angleDiff/dist and magnet helpers**

Update imports to include:
- `angleDiff` from `geom.ts`
- `clamp01`, `lerp`, `smoothstep` from `geom.ts`
- `dist` already imported

Example import line:

```ts
import { angleDiff, clamp01, hitTestOrientedRect, lerp, smoothstep, snapSatisfied } from "@/lib/puzzle/geom"
```

- [ ] **Step 2: Apply magnetism in the translate branch**

In `onPointerMove`, in the `else` branch (not `altKey`):
1. Compute raw position from pointer and drag offset (current behavior)
2. If within magnet thresholds (distance + angle), pull toward target:

```ts
const rawPos = vec(pt.x - offset.x, pt.y - offset.y)
piece.pos = rawPos

const cfg = next.snap
const d = dist(piece.pos, piece.targetPos)
const a = angleDiff(piece.rotation, piece.targetRotation)

if (d <= cfg.magnetDistancePx && a <= cfg.magnetAngleRad) {
  const t = 1 - clamp01(d / cfg.magnetDistancePx)
  const w = smoothstep(t) * cfg.magnetStrength
  piece.pos = {
    x: lerp(piece.pos.x, piece.targetPos.x, w),
    y: lerp(piece.pos.y, piece.targetPos.y, w)
  }
}
```

Keep rotation unchanged. Do not apply magnetism when `altKey` is pressed.

- [ ] **Step 3: Run lint + typecheck**

Run:

```bash
cd /workspace/apps/web
npm run lint
npm run typecheck
```

Expected: typecheck may still FAIL until puzzle states include the new snap fields.

---

### Task 4: Add magnet defaults to all puzzle states

**Files:**
- Modify: `apps/web/src/lib/puzzle/demo.ts`
- Modify: `apps/web/src/lib/puzzles/pack-1.ts`

- [ ] **Step 1: Update demo.ts snap config**

Change:

```ts
snap: { distancePx: 18, angleRad: 0.25 }
```

To:

```ts
snap: {
  distancePx: 18,
  angleRad: 0.25,
  magnetDistancePx: 40,
  magnetAngleRad: 0.45,
  magnetStrength: 0.25
}
```

- [ ] **Step 2: Update pack-1.ts snap configs**

Update each `snap: { distancePx, angleRad }` to include magnet fields.

Recommended mapping:
- 6 pcs (18 / 0.25): `magnetDistancePx: 40`, `magnetAngleRad: 0.45`, `magnetStrength: 0.25`
- 8 pcs (16 / 0.22): `magnetDistancePx: 36`, `magnetAngleRad: 0.42`, `magnetStrength: 0.22`
- 10 pcs (14 / 0.20): `magnetDistancePx: 32`, `magnetAngleRad: 0.40`, `magnetStrength: 0.20`
- 12 pcs (12 / 0.18): `magnetDistancePx: 28`, `magnetAngleRad: 0.38`, `magnetStrength: 0.18`

- [ ] **Step 3: Run format + lint + typecheck**

Run:

```bash
cd /workspace/apps/web
npm run format
npm run lint
npm run typecheck
```

Expected: PASS.

---

### Task 5: Manual verification in dev

- [ ] **Step 1: Run dev server**

Run:

```bash
cd /workspace/apps/web
npm run dev
```

- [ ] **Step 2: Manual checks**

Open `/en/play/demo-1` (or any demo puzzle) and verify:
- Far from target: piece follows pointer normally (no drift)
- Near target (within magnet distance) and rotation roughly aligned: piece gently pulls toward target
- Alt+drag rotation: no magnet tug
- Release near target: existing snap/lock works as before

