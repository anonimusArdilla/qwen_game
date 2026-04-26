# Puzzle Pack: 10 More Puzzles (Phase 5.1) Design

## Goal
Expand the puzzle catalog by adding 10 additional curated puzzles (total 11) with:
- Mixed layouts and mixed piece counts
- Target rotations in 90° steps to require rotation for completion
- Minimal duplication by using a data-driven puzzle spec + shared builder

This phase builds content and light infrastructure to define content cleanly.

## Non-Goals
- New rendering/hit-testing shapes (polygons/paths)
- Procedural generation
- Server-side persistence
- New snapping behavior (magnet previews, assist)

## Content Model

### Puzzle builder
Create a shared function to build a `PuzzleState` from a plain spec:
- Board: `{width, height}`
- Snap config: `{distancePx, angleRad}`
- Pieces: list of rectangle pieces with:
  - `id`
  - `size {w, h}`
  - `startPos {x, y}`
  - `startRotationRad`
  - `targetPos {x, y}`
  - `targetRotationRad` (restricted to `0`, `π/2`, `π`, `3π/2`)

Builder responsibilities:
- Initialize `locked: false`
- Assign `z` in a stable order
- Return a fully-formed `PuzzleState` compatible with Phase 4/5 engine

### Puzzle catalog
Add 10 new entries:
- IDs: `demo-2` … `demo-11`
- Each puzzle has:
  - `titleKey` under `puzzles.*.title`
  - `createInitialState()` wrapping its spec via the builder

## Puzzle Set (Balanced Difficulty)
Distribution (10 puzzles):
- 3 puzzles with ~6 pieces
- 3 puzzles with ~8 pieces
- 2 puzzles with ~10 pieces
- 2 puzzles with ~12 pieces

Variation dimensions:
- Target layout: grid, staggered grid, diagonal band, clustered islands, split halves
- Snap tolerance: slightly tighter for larger puzzles (smaller `distancePx` and/or `angleRad`)
- Target rotation: 90° step rotations mixed across pieces in each puzzle

## i18n
Add puzzle titles for all locales:
- `puzzles.demo2.title` … `puzzles.demo11.title`

Titles should reflect difficulty and feel (e.g., “Diagonal Drift”, “Stacked Steps”, etc.), but can remain simple “Demo Puzzle N” if preferred.

## Verification
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- Manual:
  - `/en/play` shows 11 puzzles
  - Each puzzle route loads: `/en/play/demo-2` … `/en/play/demo-11`
  - Rotation targets (90° steps) are required for snap/lock to complete
  - Completion persists per puzzle (best time + best moves)

