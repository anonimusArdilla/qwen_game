import { vec, type Vec2 } from "@/lib/puzzle/vec2"
import { type Piece, type PuzzleState } from "@/lib/puzzle/state"

type DemoPieceSpec = {
  id: string
  size: { w: number; h: number }
  targetPos: Vec2
  targetRotation: number
  startPos: Vec2
  startRotation: number
}

export function createDemoPuzzleState(): PuzzleState {
  const board = { width: 800, height: 500 }

  const piecesSpec: DemoPieceSpec[] = [
    {
      id: "p1",
      size: { w: 140, h: 80 },
      targetPos: vec(220, 170),
      targetRotation: 0,
      startPos: vec(120, 380),
      startRotation: 0.7
    },
    {
      id: "p2",
      size: { w: 110, h: 110 },
      targetPos: vec(400, 170),
      targetRotation: 0,
      startPos: vec(680, 140),
      startRotation: -0.4
    },
    {
      id: "p3",
      size: { w: 170, h: 70 },
      targetPos: vec(580, 170),
      targetRotation: 0,
      startPos: vec(640, 380),
      startRotation: 1.1
    },
    {
      id: "p4",
      size: { w: 120, h: 90 },
      targetPos: vec(270, 320),
      targetRotation: 0,
      startPos: vec(320, 70),
      startRotation: 2.4
    },
    {
      id: "p5",
      size: { w: 160, h: 60 },
      targetPos: vec(450, 320),
      targetRotation: 0,
      startPos: vec(140, 120),
      startRotation: -1.7
    },
    {
      id: "p6",
      size: { w: 90, h: 140 },
      targetPos: vec(620, 320),
      targetRotation: 0,
      startPos: vec(510, 70),
      startRotation: 0.2
    }
  ]

  const pieces: Piece[] = piecesSpec.map((s, i) => ({
    id: s.id,
    pos: { ...s.startPos },
    rotation: s.startRotation,
    targetPos: { ...s.targetPos },
    targetRotation: s.targetRotation,
    locked: false,
    z: i + 1,
    shape: { w: s.size.w, h: s.size.h }
  }))

  return {
    board,
    pieces,
    activePieceId: null,
    snap: { distancePx: 18, angleRad: 0.25 }
  }
}
