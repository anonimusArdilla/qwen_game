import { type Piece, type PuzzleState, type SnapConfig } from "@/lib/puzzle/state"
import { type Vec2 } from "@/lib/puzzle/vec2"

export type RectPieceSpec = {
  id: string
  size: { w: number; h: number }
  startPos: Vec2
  startRotation: number
  targetPos: Vec2
  targetRotation: number
}

export type PuzzleSpec = {
  board: { width: number; height: number }
  snap: SnapConfig
  pieces: RectPieceSpec[]
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
    shape: { w: p.size.w, h: p.size.h }
  }))

  return {
    board: { ...spec.board },
    pieces,
    activePieceId: null,
    snap: { ...spec.snap }
  }
}
