import { type Vec2 } from "@/lib/puzzle/vec2"

export type PieceRect = {
  w: number
  h: number
}

export type Piece = {
  id: string
  pos: Vec2
  rotation: number
  targetPos: Vec2
  targetRotation: number
  locked: boolean
  z: number
  shape: PieceRect
}

export type PuzzleBoard = {
  width: number
  height: number
}

export type SnapConfig = {
  distancePx: number
  angleRad: number
}

export type PuzzleState = {
  board: PuzzleBoard
  pieces: Piece[]
  activePieceId: string | null
  snap: SnapConfig
}

export type PieceSnapshot = Pick<Piece, "pos" | "rotation" | "locked" | "z">

export function findPiece(state: PuzzleState, id: string): Piece | undefined {
  return state.pieces.find((p) => p.id === id)
}

export function bumpZ(state: PuzzleState, id: string): number {
  const maxZ = state.pieces.reduce((acc, p) => Math.max(acc, p.z), 0)
  const nextZ = maxZ + 1
  for (const p of state.pieces) {
    if (p.id === id) p.z = nextZ
  }
  return nextZ
}

export function snapshotPiece(p: Piece): PieceSnapshot {
  return { pos: { ...p.pos }, rotation: p.rotation, locked: p.locked, z: p.z }
}

export function applySnapshot(p: Piece, snap: PieceSnapshot) {
  p.pos = { ...snap.pos }
  p.rotation = snap.rotation
  p.locked = snap.locked
  p.z = snap.z
}
