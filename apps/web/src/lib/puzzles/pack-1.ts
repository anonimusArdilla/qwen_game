import { polyominoShape } from "@/lib/puzzle/shapes"
import { vec } from "@/lib/puzzle/vec2"
import { buildPuzzleState, type PuzzleSpec } from "@/lib/puzzles/builder"

const board = { width: 800, height: 500 }
const R0 = 0
const R90 = Math.PI / 2
const R180 = Math.PI
const R270 = (3 * Math.PI) / 2
const cell = 50

function make(spec: Omit<PuzzleSpec, "board">): PuzzleSpec {
  return { ...spec, board }
}

const snap6 = {
  distancePx: 18,
  angleRad: 0.25,
  magnetDistancePx: 40,
  magnetAngleRad: 0.45,
  magnetStrength: 0.25
}

const snap8 = {
  distancePx: 16,
  angleRad: 0.22,
  magnetDistancePx: 36,
  magnetAngleRad: 0.42,
  magnetStrength: 0.22
}

const snap10 = {
  distancePx: 14,
  angleRad: 0.2,
  magnetDistancePx: 32,
  magnetAngleRad: 0.4,
  magnetStrength: 0.2
}

const snap12 = {
  distancePx: 12,
  angleRad: 0.18,
  magnetDistancePx: 28,
  magnetAngleRad: 0.36,
  magnetStrength: 0.18
}

function L4() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 }
    ],
    cell
  )
}

function T4() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 }
    ],
    cell
  )
}

function S4() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ],
    cell
  )
}

function P5() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 }
    ],
    cell
  )
}

function U5() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ],
    cell
  )
}

function V5() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 }
    ],
    cell
  )
}

function Z5() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 }
    ],
    cell
  )
}

function I3() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ],
    cell
  )
}

function L3() {
  return polyominoShape(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ],
    cell
  )
}

export function createDemo2PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap6,
      pieces: [
        {
          id: "p1",
          shape: V5(),
          startPos: vec(120, 390),
          startRotation: 0.6,
          targetPos: vec(300, 160),
          targetRotation: R0
        },
        {
          id: "p2",
          shape: U5(),
          startPos: vec(690, 130),
          startRotation: -0.7,
          targetPos: vec(450, 160),
          targetRotation: R90
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(570, 160),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.0,
          targetPos: vec(330, 320),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: T4(),
          startPos: vec(140, 120),
          startRotation: -1.5,
          targetPos: vec(480, 320),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: L4(),
          startPos: vec(520, 80),
          startRotation: 0.3,
          targetPos: vec(600, 320),
          targetRotation: R90
        }
      ]
    })
  )
}

export function createDemo3PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap6,
      pieces: [
        {
          id: "p1",
          shape: U5(),
          startPos: vec(120, 380),
          startRotation: 0.2,
          targetPos: vec(300, 150),
          targetRotation: R180
        },
        {
          id: "p2",
          shape: Z5(),
          startPos: vec(700, 360),
          startRotation: 1.0,
          targetPos: vec(450, 150),
          targetRotation: R270
        },
        {
          id: "p3",
          shape: V5(),
          startPos: vec(650, 120),
          startRotation: -1.0,
          targetPos: vec(570, 150),
          targetRotation: R90
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(320, 70),
          startRotation: 2.6,
          targetPos: vec(320, 310),
          targetRotation: R0
        },
        {
          id: "p5",
          shape: L4(),
          startPos: vec(140, 110),
          startRotation: -2.1,
          targetPos: vec(470, 310),
          targetRotation: R180
        },
        {
          id: "p6",
          shape: T4(),
          startPos: vec(540, 70),
          startRotation: 0.5,
          targetPos: vec(610, 310),
          targetRotation: R90
        }
      ]
    })
  )
}

export function createDemo4PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap6,
      pieces: [
        {
          id: "p1",
          shape: Z5(),
          startPos: vec(140, 380),
          startRotation: -0.4,
          targetPos: vec(300, 160),
          targetRotation: R90
        },
        {
          id: "p2",
          shape: V5(),
          startPos: vec(680, 150),
          startRotation: 0.8,
          targetPos: vec(450, 160),
          targetRotation: R270
        },
        {
          id: "p3",
          shape: U5(),
          startPos: vec(640, 380),
          startRotation: 1.3,
          targetPos: vec(580, 160),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: T4(),
          startPos: vec(320, 70),
          startRotation: 2.4,
          targetPos: vec(320, 320),
          targetRotation: R0
        },
        {
          id: "p5",
          shape: P5(),
          startPos: vec(160, 120),
          startRotation: -1.9,
          targetPos: vec(470, 320),
          targetRotation: R90
        },
        {
          id: "p6",
          shape: L4(),
          startPos: vec(510, 80),
          startRotation: 0.1,
          targetPos: vec(610, 320),
          targetRotation: R180
        }
      ]
    })
  )
}

export function createDemo5PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap8,
      pieces: [
        {
          id: "p1",
          shape: V5(),
          startPos: vec(120, 380),
          startRotation: 0.6,
          targetPos: vec(260, 140),
          targetRotation: R0
        },
        {
          id: "p2",
          shape: U5(),
          startPos: vec(680, 140),
          startRotation: -0.6,
          targetPos: vec(410, 140),
          targetRotation: R90
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(540, 140),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.0,
          targetPos: vec(250, 300),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: T4(),
          startPos: vec(140, 120),
          startRotation: -1.5,
          targetPos: vec(410, 300),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: L4(),
          startPos: vec(520, 80),
          startRotation: 0.3,
          targetPos: vec(560, 300),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(650, 260),
          startRotation: -0.1,
          targetPos: vec(320, 420),
          targetRotation: R0
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(150, 260),
          startRotation: 0.9,
          targetPos: vec(480, 420),
          targetRotation: R90
        }
      ]
    })
  )
}

export function createDemo6PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap8,
      pieces: [
        {
          id: "p1",
          shape: U5(),
          startPos: vec(120, 390),
          startRotation: 0.1,
          targetPos: vec(280, 140),
          targetRotation: R0
        },
        {
          id: "p2",
          shape: Z5(),
          startPos: vec(680, 130),
          startRotation: -0.8,
          targetPos: vec(420, 140),
          targetRotation: R90
        },
        {
          id: "p3",
          shape: V5(),
          startPos: vec(640, 380),
          startRotation: 1.4,
          targetPos: vec(570, 140),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.2,
          targetPos: vec(260, 300),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: L4(),
          startPos: vec(140, 110),
          startRotation: -1.8,
          targetPos: vec(420, 300),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: T4(),
          startPos: vec(520, 70),
          startRotation: 0.6,
          targetPos: vec(590, 300),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(650, 260),
          startRotation: -0.3,
          targetPos: vec(320, 420),
          targetRotation: R180
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(160, 260),
          startRotation: 1.0,
          targetPos: vec(500, 420),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo7PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap8,
      pieces: [
        {
          id: "p1",
          shape: V5(),
          startPos: vec(120, 380),
          startRotation: 0.5,
          targetPos: vec(260, 140),
          targetRotation: R180
        },
        {
          id: "p2",
          shape: U5(),
          startPos: vec(680, 140),
          startRotation: -0.4,
          targetPos: vec(410, 140),
          targetRotation: R90
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.1,
          targetPos: vec(540, 140),
          targetRotation: R0
        },
        {
          id: "p4",
          shape: T4(),
          startPos: vec(330, 70),
          startRotation: 2.0,
          targetPos: vec(250, 300),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: P5(),
          startPos: vec(140, 120),
          startRotation: -1.4,
          targetPos: vec(410, 300),
          targetRotation: R180
        },
        {
          id: "p6",
          shape: L4(),
          startPos: vec(520, 80),
          startRotation: 0.2,
          targetPos: vec(560, 300),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(650, 260),
          startRotation: 0.8,
          targetPos: vec(320, 420),
          targetRotation: R0
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(160, 260),
          startRotation: -0.6,
          targetPos: vec(480, 420),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo8PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap10,
      pieces: [
        {
          id: "p1",
          shape: V5(),
          startPos: vec(120, 390),
          startRotation: 0.2,
          targetPos: vec(240, 120),
          targetRotation: R90
        },
        {
          id: "p2",
          shape: U5(),
          startPos: vec(690, 140),
          startRotation: -0.8,
          targetPos: vec(380, 120),
          targetRotation: R0
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(520, 120),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.2,
          targetPos: vec(260, 260),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: T4(),
          startPos: vec(140, 110),
          startRotation: -1.9,
          targetPos: vec(410, 260),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: L4(),
          startPos: vec(520, 70),
          startRotation: 0.5,
          targetPos: vec(560, 260),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(640, 260),
          startRotation: -0.3,
          targetPos: vec(300, 390),
          targetRotation: R180
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(160, 260),
          startRotation: 1.0,
          targetPos: vec(450, 390),
          targetRotation: R270
        },
        {
          id: "p9",
          shape: I3(),
          startPos: vec(710, 250),
          startRotation: 0.9,
          targetPos: vec(580, 390),
          targetRotation: R90
        },
        {
          id: "p10",
          shape: L3(),
          startPos: vec(90, 250),
          startRotation: -0.6,
          targetPos: vec(140, 390),
          targetRotation: R0
        }
      ]
    })
  )
}

export function createDemo9PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap10,
      pieces: [
        {
          id: "p1",
          shape: U5(),
          startPos: vec(120, 380),
          startRotation: 0.4,
          targetPos: vec(240, 120),
          targetRotation: R0
        },
        {
          id: "p2",
          shape: V5(),
          startPos: vec(690, 150),
          startRotation: -0.7,
          targetPos: vec(380, 120),
          targetRotation: R90
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.1,
          targetPos: vec(520, 120),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.0,
          targetPos: vec(260, 260),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: L4(),
          startPos: vec(140, 120),
          startRotation: -1.5,
          targetPos: vec(410, 260),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: T4(),
          startPos: vec(520, 80),
          startRotation: 0.2,
          targetPos: vec(560, 260),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(640, 260),
          startRotation: 0.8,
          targetPos: vec(300, 390),
          targetRotation: R180
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(160, 260),
          startRotation: -0.4,
          targetPos: vec(450, 390),
          targetRotation: R270
        },
        {
          id: "p9",
          shape: I3(),
          startPos: vec(710, 250),
          startRotation: 0.5,
          targetPos: vec(580, 390),
          targetRotation: R0
        },
        {
          id: "p10",
          shape: L3(),
          startPos: vec(90, 250),
          startRotation: -0.3,
          targetPos: vec(140, 390),
          targetRotation: R90
        }
      ]
    })
  )
}

export function createDemo10PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap12,
      pieces: [
        {
          id: "p1",
          shape: V5(),
          startPos: vec(120, 390),
          startRotation: 0.2,
          targetPos: vec(220, 110),
          targetRotation: R90
        },
        {
          id: "p2",
          shape: U5(),
          startPos: vec(690, 140),
          startRotation: -0.8,
          targetPos: vec(360, 110),
          targetRotation: R0
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(500, 110),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.2,
          targetPos: vec(240, 250),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: T4(),
          startPos: vec(140, 110),
          startRotation: -1.9,
          targetPos: vec(390, 250),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: L4(),
          startPos: vec(520, 70),
          startRotation: 0.5,
          targetPos: vec(530, 250),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(640, 260),
          startRotation: -0.3,
          targetPos: vec(290, 380),
          targetRotation: R180
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(160, 260),
          startRotation: 1.0,
          targetPos: vec(430, 380),
          targetRotation: R270
        },
        {
          id: "p9",
          shape: I3(),
          startPos: vec(710, 250),
          startRotation: 0.9,
          targetPos: vec(560, 380),
          targetRotation: R90
        },
        {
          id: "p10",
          shape: L3(),
          startPos: vec(90, 250),
          startRotation: -0.6,
          targetPos: vec(140, 380),
          targetRotation: R0
        },
        {
          id: "p11",
          shape: I3(),
          startPos: vec(700, 60),
          startRotation: -0.2,
          targetPos: vec(660, 380),
          targetRotation: R180
        },
        {
          id: "p12",
          shape: L4(),
          startPos: vec(100, 60),
          startRotation: 0.8,
          targetPos: vec(60, 380),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo11PuzzleState() {
  return buildPuzzleState(
    make({
      snap: snap12,
      pieces: [
        {
          id: "p1",
          shape: U5(),
          startPos: vec(120, 390),
          startRotation: 0.3,
          targetPos: vec(220, 110),
          targetRotation: R0
        },
        {
          id: "p2",
          shape: V5(),
          startPos: vec(690, 140),
          startRotation: -0.9,
          targetPos: vec(360, 110),
          targetRotation: R90
        },
        {
          id: "p3",
          shape: Z5(),
          startPos: vec(640, 380),
          startRotation: 1.1,
          targetPos: vec(500, 110),
          targetRotation: R180
        },
        {
          id: "p4",
          shape: P5(),
          startPos: vec(330, 70),
          startRotation: 2.0,
          targetPos: vec(240, 250),
          targetRotation: R270
        },
        {
          id: "p5",
          shape: L4(),
          startPos: vec(140, 120),
          startRotation: -1.6,
          targetPos: vec(390, 250),
          targetRotation: R0
        },
        {
          id: "p6",
          shape: T4(),
          startPos: vec(520, 80),
          startRotation: 0.2,
          targetPos: vec(530, 250),
          targetRotation: R90
        },
        {
          id: "p7",
          shape: S4(),
          startPos: vec(640, 260),
          startRotation: 0.8,
          targetPos: vec(290, 380),
          targetRotation: R180
        },
        {
          id: "p8",
          shape: L3(),
          startPos: vec(160, 260),
          startRotation: -0.5,
          targetPos: vec(430, 380),
          targetRotation: R270
        },
        {
          id: "p9",
          shape: I3(),
          startPos: vec(710, 250),
          startRotation: 0.4,
          targetPos: vec(560, 380),
          targetRotation: R0
        },
        {
          id: "p10",
          shape: L3(),
          startPos: vec(90, 250),
          startRotation: -0.3,
          targetPos: vec(140, 380),
          targetRotation: R90
        },
        {
          id: "p11",
          shape: I3(),
          startPos: vec(700, 60),
          startRotation: 0.7,
          targetPos: vec(660, 380),
          targetRotation: R180
        },
        {
          id: "p12",
          shape: L4(),
          startPos: vec(100, 60),
          startRotation: -0.4,
          targetPos: vec(60, 380),
          targetRotation: R270
        }
      ]
    })
  )
}
