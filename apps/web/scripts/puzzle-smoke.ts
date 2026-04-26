import assert from "node:assert/strict"

import { createDemoPuzzleState } from "../src/lib/puzzle/demo"
import { angleDiff } from "../src/lib/puzzle/geom"
import { snapshotPiece } from "../src/lib/puzzle/state"
import { captureMoveRotate, createUndoState, recordAction, undoOnce } from "../src/lib/puzzle/undo"

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

process.stdout.write("puzzle-smoke: ok\n")
