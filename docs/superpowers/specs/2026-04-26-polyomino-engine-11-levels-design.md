# Polyomino Engine + 11 “Real” Packing Levels (Design)

## Goal
Replace the current rectangle-only “basic” puzzles with more realistic wooden packing puzzles (polyomino / Tetris-like pieces), inspired by classic packing puzzles, for all 11 existing levels.

Success criteria:
- All 11 existing puzzle routes remain (`/play/<puzzleId>`), but the piece sets become polyomino-style.
- Pieces render as multi-rect “wood blocks” and targets render matching outlines.
- Drag / rotate / snap / magnetism continue to work.
- No runtime errors from shape rendering or hit-testing.

Non-goals (for this phase):
- Perfect physical simulation, collision constraints, or “no overlap” enforcement.
- Exact replication of a commercial puzzle’s proprietary layouts.

## Current Constraints / Baseline
The current engine supports only oriented rectangles:
- `Piece.shape` is `{ w, h }` and rendering + hit test assume one rect.
- Puzzle specs are built via `buildPuzzleState()` using `size: {w,h}` per piece.

To match “Five Fit”-style puzzles, the engine needs compound shapes.

## Shape Model
Introduce a new piece shape representation that supports both simple rectangles and compound shapes:

- **PieceRectLocal**
  - `{ x: number; y: number; w: number; h: number }` in piece-local coordinates (before rotation)
- **PieceShape**
  - `{ kind: "rect"; w: number; h: number }`
  - `{ kind: "compound"; rects: PieceRectLocal[] }`

All rendering and hit-testing consume `PieceShape`.
Existing rectangle puzzles map to `kind: "rect"` with identical behavior.

## Rendering
Update the canvas renderer to draw:
- **Targets**: the shape at `targetPos` + `targetRotation` as dashed outlines
- **Pieces**: the same shape at `pos` + `rotation` filled with wood color and stroke

Implementation detail:
- Convert shapes to a list of local rects:
  - `rect` → single `[{ x: -w/2, y: -h/2, w, h }]`
  - `compound` → `rects` as-is
- For each rect, draw a rounded-rect path (existing helper) and fill/stroke.

## Hit-Testing
Replace the single-rect hit test with:
- Transform pointer point into piece-local coordinates:
  - `ptLocal = rotate(ptWorld - piece.pos, -piece.rotation)`
- Test whether `ptLocal` is inside any local rect in the shape’s rect list.

This preserves the current interaction model and does not require collision detection.

## Puzzle Spec / Builder
Extend puzzle specs to define polyomino pieces:
- Update `PuzzleSpec` to accept `shape` rather than only `size`.
- Provide helpers:
  - `rectShape(w,h)`
  - `polyominoShape(cells, cellSizePx)` where `cells` is an array of grid points like `{x,y}`.

For `polyominoShape`:
- Each grid cell becomes a rect `{ x: cellX*cellSize, y: cellY*cellSize, w: cellSize, h: cellSize }`.
- Normalize so the overall shape is centered at (0,0) for intuitive rotation.

## Level Content (11 levels)
Replace the current piece sets for the existing 11 puzzle IDs:
- `starter-six`
- `diagonal-six`
- `cascade-six`
- `cross-six`
- `stack-eight`
- `stagger-eight`
- `split-eight`
- `drift-ten`
- `orbit-ten`
- `dense-twelve-a`
- `dense-twelve-b`

Each level will be authored as:
- A fixed “solved” packing arrangement on the board (grid-aligned).
- Each piece has:
  - `shape` (polyomino)
  - `targetPos`/`targetRotation` that match the solved arrangement
  - `startPos`/`startRotation` scrambled around the perimeter

Difficulty will scale by:
- number of pieces (6 → 12)
- number of non-rectangular pieces
- required rotations
- tighter packing in the solved layout

## “Research similar ones” Interpretation
We will base pieces on classic polyomino families (tetromino/pentomino-like silhouettes) and generate original arrangements per level.
We will not copy a specific branded board layout 1:1.

## Verification
- Manual:
  - `/en/play` loads and lists all 11 puzzles.
  - Each puzzle renders compound pieces and targets.
  - Drag and rotate work, snapping locks pieces when aligned.
- Automated:
  - Extend the existing smoke script to ensure:
    - every piece shape has at least 1 rect
    - rects have positive `w/h`
    - targets exist for all pieces

