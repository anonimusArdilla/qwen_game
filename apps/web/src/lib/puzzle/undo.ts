import {
  applySnapshot,
  findPiece,
  snapshotPiece,
  type PieceSnapshot,
  type PuzzleState
} from "./state"

export type MoveRotateAction = {
  kind: "moveRotate"
  pieceId: string
  before: PieceSnapshot
  after: PieceSnapshot
}

export type PuzzleAction = MoveRotateAction

export type UndoState = {
  past: PuzzleAction[]
  future: PuzzleAction[]
  maxDepth: number
}

export function createUndoState(maxDepth = 100): UndoState {
  return { past: [], future: [], maxDepth }
}

export function recordAction(undo: UndoState, action: PuzzleAction) {
  undo.past.push(action)
  if (undo.past.length > undo.maxDepth) {
    undo.past.shift()
  }
  undo.future = []
}

export function undoOnce(state: PuzzleState, undo: UndoState) {
  const action = undo.past.pop()
  if (!action) return
  undo.future.push(action)

  if (action.kind === "moveRotate") {
    const piece = findPiece(state, action.pieceId)
    if (!piece) return
    applySnapshot(piece, action.before)
  }
}

export function redoOnce(state: PuzzleState, undo: UndoState) {
  const action = undo.future.pop()
  if (!action) return
  undo.past.push(action)

  if (action.kind === "moveRotate") {
    const piece = findPiece(state, action.pieceId)
    if (!piece) return
    applySnapshot(piece, action.after)
  }
}

export function captureMoveRotate(
  state: PuzzleState,
  pieceId: string,
  before: PieceSnapshot
): PuzzleAction {
  const piece = findPiece(state, pieceId)
  if (!piece) {
    return {
      kind: "moveRotate",
      pieceId,
      before,
      after: before
    }
  }

  return {
    kind: "moveRotate",
    pieceId,
    before,
    after: snapshotPiece(piece)
  }
}
