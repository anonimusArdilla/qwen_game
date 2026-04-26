import { type Piece, type PieceShape, type PuzzleState, type SnapConfig } from "@/lib/puzzle/state"
import { rectShape } from "@/lib/puzzle/shapes"
import { type Vec2 } from "@/lib/puzzle/vec2"

export type SizePieceSpec = {
  id: string
  size: { w: number; h: number }
  startPos: Vec2
  startRotation: number
  targetPos: Vec2
  targetRotation: number
}

export type ShapePieceSpec = {
  id: string
  shape: PieceShape
  startPos: Vec2
  startRotation: number
  targetPos: Vec2
  targetRotation: number
}

export type PieceSpec = SizePieceSpec | ShapePieceSpec

export type PuzzleSpec = {
  board: { width: number; height: number }
  snap: SnapConfig
  pieces: PieceSpec[]
}

export function buildPuzzleState(spec: PuzzleSpec): PuzzleState {
  const pieces: Piece[] = spec.pieces.map((p, i) => ({
    id: p.id,
    pos: { ...p.startPos },
    rotation: p.startRotation,
    targetPos: { ...p.targetPos },
    targetRotation: p.targetRotation,
    locked: false,
    z: i + 1,
    shape: "shape" in p ? p.shape : rectShape(p.size.w, p.size.h)
  }))

  return {
    board: { ...spec.board },
    pieces,
    activePieceId: null,
    snap: { ...spec.snap }
  }
}
