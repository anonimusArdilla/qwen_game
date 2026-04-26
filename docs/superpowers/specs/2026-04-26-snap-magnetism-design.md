# Snap Feel: Magnetism (Phase 6) Design

## Goal
Improve the “snap feel” while dragging by adding gentle magnetism toward the target position when a piece is close enough (and reasonably aligned). Pieces still only lock on release using existing snap rules.

## Non-Goals
- Visual snap preview/ghost
- Rotation assist (beyond the existing snap-on-release angle threshold)
- New piece shapes (polygons/paths)

## Behavior
### When magnetism applies
Magnetism is applied on pointer-move (dragging), only when:
- the active piece is being translated (not rotating with Alt)
- the piece is not locked
- `dist(pos, targetPos) <= magnetDistancePx`
- `angleDiff(rotation, targetRotation) <= magnetAngleRad`

### How magnetism is applied
Compute a closeness factor `t` in `[0..1]` (0 at boundary, 1 at the target). Apply smoothing:
- `t = 1 - clamp(dist / magnetDistancePx, 0, 1)`
- `tSmooth = smoothstep(t)`
- `pos = lerp(pos, targetPos, tSmooth * magnetStrength)`

This keeps the piece “pulling” gently without hard snapping and allows escaping.

### Locking remains unchanged
On pointer-up:
- evaluate existing `snapSatisfied` (distance + angle)
- if satisfied: snap to exact target and set `locked: true`

## Config
Extend puzzle configuration to include:
- `magnetDistancePx: number`
- `magnetAngleRad: number`
- `magnetStrength: number` (recommended 0.15–0.35)

Defaults:
- `magnetDistancePx` slightly larger than snap distance (e.g. snap 18 → magnet 40)
- `magnetAngleRad` slightly larger than snap angle (e.g. snap 0.25 → magnet 0.45)

## Files to Modify
- `apps/web/src/lib/puzzle/state.ts` (extend config types)
- `apps/web/src/lib/puzzle/geom.ts` (add lerp + smoothstep utilities or in a new helper)
- `apps/web/src/components/PuzzleCanvas.tsx` (apply magnetism during drag movement)
- `apps/web/src/lib/puzzle/demo.ts` and `apps/web/src/lib/puzzles/pack-1.ts` (provide magnet defaults per puzzle)

## Verification
- Lint/typecheck pass
- Manual:
  - Drag near target: piece gently pulls toward target
  - Far from target: no pull
  - When rotation is far off: no pull
  - Locking still only happens on release
  - Alt-rotate does not fight magnetism

