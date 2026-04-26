import assert from "node:assert/strict"

import { createDemoPuzzleState } from "../src/lib/puzzle/demo"
import { angleDiff } from "../src/lib/puzzle/geom"
import { toLocalRects } from "../src/lib/puzzle/shapes"
import { snapshotPiece } from "../src/lib/puzzle/state"
import { captureMoveRotate, createUndoState, recordAction, undoOnce } from "../src/lib/puzzle/undo"
import { puzzles } from "../src/lib/puzzles/catalog"

assert.ok(angleDiff(Math.PI * 2, 0) < 1e-9)
assert.ok(angleDiff(Math.PI * 0.1, -Math.PI * 1.9) < 1e-6)

const state = createDemoPuzzleState()
const undo = createUndoState()

const p = state.pieces[0]
if (!p) {
  throw new Error("Missing demo piece")
}
const before = snapshotPiece(p)
p.pos.x += 10
p.rotation += 0.1

recordAction(undo, captureMoveRotate(state, p.id, before))
undoOnce(state, undo)

const p0 = state.pieces[0]
if (!p0) {
  throw new Error("Missing demo piece")
}
assert.equal(p0.pos.x, before.pos.x)
assert.equal(p0.pos.y, before.pos.y)

for (const puzzle of puzzles) {
  const s = puzzle.createInitialState()
  for (const piece of s.pieces) {
    const rects = toLocalRects(piece.shape)
    if (rects.length === 0) throw new Error(`no rects: ${puzzle.id}:${piece.id}`)
    for (const r of rects) {
      if (!(r.w > 0 && r.h > 0)) throw new Error(`invalid rect: ${puzzle.id}:${piece.id}`)
    }
    if (piece.shape.kind === "compound" && rects.length < 2) {
      throw new Error(`compound too small: ${puzzle.id}:${piece.id}`)
    }
  }
}

process.stdout.write("puzzle-smoke: ok\n")
