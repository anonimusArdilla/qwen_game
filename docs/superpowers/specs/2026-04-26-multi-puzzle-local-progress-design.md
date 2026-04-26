# Multi-Puzzle + Local Progress (Phase 5) Design

## Goal
Turn the Phase 4 single demo puzzle into a small multi-puzzle experience with:
- Puzzle catalog (multiple puzzles)
- Puzzle picker UI
- Per-puzzle progress saved locally (completion + best time + best moves)
- URL addressable puzzle route: `/[locale]/play/[puzzleId]`

## Non-Goals (Phase 5)
- Server accounts or cloud sync
- Procedural generation
- Advanced shapes (still rectangles, as in Phase 4)
- Deep UX polish (haptics, mobile gestures, accessibility beyond current baseline)

## Routes
- `/[locale]/play`
  - Displays catalog list
  - Shows completed state + best stats (if any)
- `/[locale]/play/[puzzleId]`
  - Renders playable canvas + HUD
  - Updates progress on completion

## Puzzle Catalog
Create a small, explicit catalog module:
- `PuzzleDefinition`:
  - `id: string`
  - `titleKey: string` (i18n key, e.g. `puzzles.demo1.title`)
  - `createInitialState(): PuzzleState`

Catalog lives in `src/lib/puzzles/catalog.ts`.

## Progress Storage
Store a single JSON blob in `localStorage`:
- Key: `woodenPuzzles.progress.v1`
- Value:
  - `{ [puzzleId: string]: { completed: boolean; bestTimeMs?: number; bestMoves?: number } }`

Update rules:
- `completed` becomes `true` once solved
- `bestTimeMs` updates only if new time is lower
- `bestMoves` updates only if new moves is lower

Progress helpers live in `src/lib/puzzles/progress.ts`:
- `loadProgress()`
- `saveProgress()`
- `mergeResult(puzzleId, {timeMs, moves})`

## Completion Detection
A puzzle is complete when all pieces are locked:
- `state.pieces.every(p => p.locked)`

## Time & Moves
- Time starts when puzzle view mounts or puzzle state resets.
- Time stops when completion is detected.
- Moves count increments for each recorded `undo` action (already captured on pointer up).

## UI
### Puzzle Picker
Each item shows:
- Title
- Completed badge if completed
- Best time + best moves if present

### Puzzle HUD
- Back to list
- Reset
- Current time
- Current moves

## i18n Keys
Add keys for:
- `nav.puzzles` (optional if desired)
- `puzzles.*.title`
- `play.completed`
- `play.bestTime`
- `play.bestMoves`
- `play.time`
- `play.moves`
- `play.back`

Time formatting:
- Format mm:ss on the client, using a small helper `formatDurationMs(ms)`.

## Verification
- Format/lint/typecheck pass
- Manual:
  - Can navigate from /play to /play/[id]
  - Completing puzzle persists progress
  - Refresh retains completed badge and best stats
  - Best time/moves only improve (never regress)

