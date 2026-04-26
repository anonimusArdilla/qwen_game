import { vec, type Vec2 } from "@/lib/puzzle/vec2"
import { type Piece, type PuzzleState } from "@/lib/puzzle/state"
import { polyominoShape } from "@/lib/puzzle/shapes"

type DemoPieceSpec = {
  id: string
  cells: readonly { x: number; y: number }[]
  targetPos: Vec2
  targetRotation: number
  startPos: Vec2
  startRotation: number
}

export function createDemoPuzzleState(): PuzzleState {
  const board = { width: 800, height: 500 }
  const cell = 50

  const piecesSpec: DemoPieceSpec[] = [
    {
      id: "p1",
      cells: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 }
      ],
      targetPos: vec(220, 170),
      targetRotation: 0,
      startPos: vec(120, 380),
      startRotation: 0.7
    },
    {
      id: "p2",
      cells: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 }
      ],
      targetPos: vec(400, 170),
      targetRotation: 0,
      startPos: vec(680, 140),
      startRotation: -0.4
    },
    {
      id: "p3",
      cells: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 }
      ],
      targetPos: vec(580, 170),
      targetRotation: 0,
      startPos: vec(640, 380),
      startRotation: 1.1
    },
    {
      id: "p4",
      cells: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 }
      ],
      targetPos: vec(270, 320),
      targetRotation: 0,
      startPos: vec(320, 70),
      startRotation: 2.4
    },
    {
      id: "p5",
      cells: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 2 }
      ],
      targetPos: vec(450, 320),
      targetRotation: 0,
      startPos: vec(140, 120),
      startRotation: -1.7
    },
    {
      id: "p6",
      cells: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 }
      ],
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
    shape: polyominoShape(s.cells, cell)
  }))

  return {
    board,
    pieces,
    activePieceId: null,
    snap: {
      distancePx: 18,
      angleRad: 0.25,
      magnetDistancePx: 40,
      magnetAngleRad: 0.45,
      magnetStrength: 0.25
    }
  }
}
