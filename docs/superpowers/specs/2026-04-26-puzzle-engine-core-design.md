# Puzzle Engine Core (Phase 4) Design

## Goal
Create the first playable wooden puzzle prototype on the web app with:
- Canvas rendering
- Free drag + snap-to-target behavior
- Free rotation
- Undo/redo
- A minimal `/[locale]/play` route to exercise the engine

This phase is about engine correctness and interaction feel, not final art.

## Non-Goals (Phase 4)
- Procedural puzzle generation
- Complex piece silhouettes (jigsaw tabs), image-based puzzles
- Multiplayer, accounts, achievements, levels
- Mobile polish beyond basic pointer input support

## Rendering & Interaction Approach
Use a single `<canvas>` and a small, testable geometry/engine core:
- UI layer: React page + Canvas component for rendering and pointer events
- Core layer: pure functions for transforms, hit-testing, snapping, and undo/redo actions

Reasons:
- Canvas is best fit for performance with many pieces and continuous transforms.
- Avoid large dependency surface; keep engine logic testable without DOM.

## Data Model

### Coordinate system
- Board coordinate space is in CSS pixels (logical pixels).
- Canvas is scaled for devicePixelRatio for crisp rendering.

### Types
- `Vec2`: `{x: number, y: number}`
- `Piece`:
  - `id: string`
  - `pos: Vec2`
  - `rotation: number` (radians)
  - `targetPos: Vec2`
  - `targetRotation: number` (radians)
  - `locked: boolean`
  - `z: number`
  - `shape`: initial Phase 4 uses simple rectangles (width/height) for hit test and draw
- `PuzzleState`:
  - `board: {width: number, height: number}`
  - `pieces: Piece[]`
  - `activePieceId: string | null`
  - `dragOffsetLocal?: Vec2` (cursor-to-piece local offset for stable dragging)
  - `snap: {distancePx: number, angleRad: number}`

## Interactions

### Picking / hit testing
- On pointer down:
  - Determine topmost piece under cursor (iterate pieces sorted by `z` descending).
  - Ignore `locked` pieces.
  - Set `activePieceId` and bring piece to top by bumping `z`.

Hit test (Phase 4):
- Use oriented rectangle hit test:
  - transform cursor point into piece-local coordinates by inverse rotate + inverse translate
  - check within `[-w/2, w/2]` and `[-h/2, h/2]`

### Dragging
- On pointer move:
  - Update piece position so that the original local drag offset remains under the pointer.

### Rotation (free)
- Use modifier + drag:
  - While dragging and `Alt` is pressed, rotate around piece center:
    - compute angle between center→pointer at start and current
    - apply delta to rotation
- Rotation does not move the piece center.

### Snap
On pointer up:
- If the active piece is within:
  - `distance(pos, targetPos) <= snap.distancePx`
  - `angleDiff(rotation, targetRotation) <= snap.angleRad` (wrapped)
Then:
- snap pos + rotation to target
- set `locked: true`

## Undo / Redo
Store an action history of piece transforms:
- Action types:
  - `moveRotate` with `before` and `after` states for the piece
  - `lock` / `unlock` (or fold into `moveRotate` with `locked` flag)
- History constraints:
  - Fixed max depth (e.g. 100)
  - New action clears redo stack

## UI Surface (Phase 4)
- New route: `src/app/[locale]/play/page.tsx`
- Components:
  - `PuzzleCanvas` (client): owns canvas ref, render loop, pointer input
  - Minimal toolbar: Undo, Redo, Reset

## Minimal Demo Puzzle
- Board: 800×500 logical px
- Pieces: 6 rectangles with varied sizes
- Targets: arranged in a pleasing grid; initial positions scattered

## Verification
- Lint/typecheck passes
- Manual:
  - Drag works
  - Alt+drag rotation works
  - Snap occurs near target (pos+angle)
  - Locked pieces cannot be moved
  - Undo/redo restores previous transforms and lock state
  - Reset restores initial state

## Files To Create / Modify
Create:
- `apps/web/src/lib/puzzle/vec2.ts`
- `apps/web/src/lib/puzzle/geom.ts`
- `apps/web/src/lib/puzzle/state.ts`
- `apps/web/src/lib/puzzle/undo.ts`
- `apps/web/src/lib/puzzle/demo.ts`
- `apps/web/src/components/PuzzleCanvas.tsx`
- `apps/web/src/app/[locale]/play/page.tsx`

Modify:
- `apps/web/src/i18n/messages/*` (add play/toolbar strings)
- `apps/web/src/components/AppShell.tsx` (add nav link to Play)

