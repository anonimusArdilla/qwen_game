import { vec } from "@/lib/puzzle/vec2"
import { buildPuzzleState, type PuzzleSpec } from "@/lib/puzzles/builder"

const board = { width: 800, height: 500 }
const R0 = 0
const R90 = Math.PI / 2
const R180 = Math.PI
const R270 = (3 * Math.PI) / 2

function make(spec: Omit<PuzzleSpec, "board">): PuzzleSpec {
  return { ...spec, board }
}

const base6 = [
  { id: "p1", w: 140, h: 80 },
  { id: "p2", w: 110, h: 110 },
  { id: "p3", w: 170, h: 70 },
  { id: "p4", w: 120, h: 90 },
  { id: "p5", w: 160, h: 60 },
  { id: "p6", w: 90, h: 140 }
] as const

const extra2 = [
  { id: "p7", w: 90, h: 70 },
  { id: "p8", w: 70, h: 90 }
] as const

const extra4 = [
  { id: "p9", w: 100, h: 60 },
  { id: "p10", w: 60, h: 100 }
] as const

const extra6 = [
  { id: "p11", w: 80, h: 50 },
  { id: "p12", w: 50, h: 80 }
] as const

export function createDemo2PuzzleState() {
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 18,
        angleRad: 0.25,
        magnetDistancePx: 40,
        magnetAngleRad: 0.45,
        magnetStrength: 0.25
      },
      pieces: [
        {
          id: base6[0].id,
          size: { w: base6[0].w, h: base6[0].h },
          startPos: vec(120, 390),
          startRotation: 0.6,
          targetPos: vec(220, 140),
          targetRotation: R90
        },
        {
          id: base6[1].id,
          size: { w: base6[1].w, h: base6[1].h },
          startPos: vec(690, 130),
          startRotation: -0.7,
          targetPos: vec(400, 140),
          targetRotation: R0
        },
        {
          id: base6[2].id,
          size: { w: base6[2].w, h: base6[2].h },
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(580, 140),
          targetRotation: R180
        },
        {
          id: base6[3].id,
          size: { w: base6[3].w, h: base6[3].h },
          startPos: vec(330, 70),
          startRotation: 2.0,
          targetPos: vec(260, 310),
          targetRotation: R270
        },
        {
          id: base6[4].id,
          size: { w: base6[4].w, h: base6[4].h },
          startPos: vec(140, 120),
          startRotation: -1.5,
          targetPos: vec(450, 310),
          targetRotation: R0
        },
        {
          id: base6[5].id,
          size: { w: base6[5].w, h: base6[5].h },
          startPos: vec(520, 80),
          startRotation: 0.3,
          targetPos: vec(620, 310),
          targetRotation: R90
        }
      ]
    })
  )
}

export function createDemo3PuzzleState() {
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 18,
        angleRad: 0.25,
        magnetDistancePx: 40,
        magnetAngleRad: 0.45,
        magnetStrength: 0.25
      },
      pieces: [
        {
          id: base6[0].id,
          size: { w: base6[0].w, h: base6[0].h },
          startPos: vec(120, 380),
          startRotation: 0.2,
          targetPos: vec(190, 180),
          targetRotation: R0
        },
        {
          id: base6[1].id,
          size: { w: base6[1].w, h: base6[1].h },
          startPos: vec(700, 360),
          startRotation: 1.0,
          targetPos: vec(340, 230),
          targetRotation: R90
        },
        {
          id: base6[2].id,
          size: { w: base6[2].w, h: base6[2].h },
          startPos: vec(650, 120),
          startRotation: -1.0,
          targetPos: vec(520, 280),
          targetRotation: R270
        },
        {
          id: base6[3].id,
          size: { w: base6[3].w, h: base6[3].h },
          startPos: vec(320, 70),
          startRotation: 2.6,
          targetPos: vec(260, 320),
          targetRotation: R180
        },
        {
          id: base6[4].id,
          size: { w: base6[4].w, h: base6[4].h },
          startPos: vec(140, 110),
          startRotation: -2.1,
          targetPos: vec(460, 370),
          targetRotation: R0
        },
        {
          id: base6[5].id,
          size: { w: base6[5].w, h: base6[5].h },
          startPos: vec(540, 70),
          startRotation: 0.5,
          targetPos: vec(650, 420),
          targetRotation: R90
        }
      ]
    })
  )
}

export function createDemo4PuzzleState() {
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 18,
        angleRad: 0.25,
        magnetDistancePx: 40,
        magnetAngleRad: 0.45,
        magnetStrength: 0.25
      },
      pieces: [
        {
          id: base6[0].id,
          size: { w: base6[0].w, h: base6[0].h },
          startPos: vec(140, 380),
          startRotation: -0.4,
          targetPos: vec(240, 160),
          targetRotation: R180
        },
        {
          id: base6[1].id,
          size: { w: base6[1].w, h: base6[1].h },
          startPos: vec(680, 150),
          startRotation: 0.8,
          targetPos: vec(420, 210),
          targetRotation: R270
        },
        {
          id: base6[2].id,
          size: { w: base6[2].w, h: base6[2].h },
          startPos: vec(640, 380),
          startRotation: 1.3,
          targetPos: vec(580, 260),
          targetRotation: R90
        },
        {
          id: base6[3].id,
          size: { w: base6[3].w, h: base6[3].h },
          startPos: vec(320, 70),
          startRotation: 2.4,
          targetPos: vec(310, 330),
          targetRotation: R0
        },
        {
          id: base6[4].id,
          size: { w: base6[4].w, h: base6[4].h },
          startPos: vec(160, 120),
          startRotation: -1.9,
          targetPos: vec(500, 380),
          targetRotation: R180
        },
        {
          id: base6[5].id,
          size: { w: base6[5].w, h: base6[5].h },
          startPos: vec(510, 80),
          startRotation: 0.1,
          targetPos: vec(670, 330),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo5PuzzleState() {
  const pieces = [...base6, ...extra2] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 16,
        angleRad: 0.22,
        magnetDistancePx: 36,
        magnetAngleRad: 0.42,
        magnetStrength: 0.22
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(120, 380),
          startRotation: 0.6,
          targetPos: vec(200, 140),
          targetRotation: R90
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(680, 140),
          startRotation: -0.6,
          targetPos: vec(360, 140),
          targetRotation: R0
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(640, 380),
          startRotation: 1.0,
          targetPos: vec(540, 140),
          targetRotation: R180
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(320, 70),
          startRotation: 2.2,
          targetPos: vec(240, 290),
          targetRotation: R270
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(150, 120),
          startRotation: -1.5,
          targetPos: vec(420, 290),
          targetRotation: R0
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(510, 70),
          startRotation: 0.2,
          targetPos: vec(600, 290),
          targetRotation: R90
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 300),
          startRotation: -0.9,
          targetPos: vec(300, 420),
          targetRotation: R180
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(60, 260),
          startRotation: 1.4,
          targetPos: vec(500, 420),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo6PuzzleState() {
  const pieces = [...base6, ...extra2] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 16,
        angleRad: 0.22,
        magnetDistancePx: 36,
        magnetAngleRad: 0.42,
        magnetStrength: 0.22
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(140, 380),
          startRotation: -0.2,
          targetPos: vec(220, 170),
          targetRotation: R0
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(700, 140),
          startRotation: 1.1,
          targetPos: vec(420, 170),
          targetRotation: R90
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(640, 380),
          startRotation: -1.0,
          targetPos: vec(580, 170),
          targetRotation: R270
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(320, 70),
          startRotation: 2.1,
          targetPos: vec(260, 320),
          targetRotation: R180
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(160, 120),
          startRotation: -1.7,
          targetPos: vec(450, 320),
          targetRotation: R0
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(510, 70),
          startRotation: 0.6,
          targetPos: vec(650, 320),
          targetRotation: R90
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 260),
          startRotation: 0.4,
          targetPos: vec(350, 430),
          targetRotation: R270
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(70, 250),
          startRotation: -0.8,
          targetPos: vec(520, 430),
          targetRotation: R180
        }
      ]
    })
  )
}

export function createDemo7PuzzleState() {
  const pieces = [...base6, ...extra2] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 16,
        angleRad: 0.22,
        magnetDistancePx: 36,
        magnetAngleRad: 0.42,
        magnetStrength: 0.22
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(120, 390),
          startRotation: 0.5,
          targetPos: vec(260, 150),
          targetRotation: R180
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(700, 140),
          startRotation: -0.5,
          targetPos: vec(420, 200),
          targetRotation: R270
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(650, 380),
          startRotation: 1.3,
          targetPos: vec(560, 250),
          targetRotation: R90
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(320, 70),
          startRotation: 2.2,
          targetPos: vec(300, 320),
          targetRotation: R0
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(150, 120),
          startRotation: -1.6,
          targetPos: vec(470, 370),
          targetRotation: R180
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(520, 70),
          startRotation: 0.2,
          targetPos: vec(640, 330),
          targetRotation: R270
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 260),
          startRotation: -1.1,
          targetPos: vec(240, 440),
          targetRotation: R90
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(70, 250),
          startRotation: 0.9,
          targetPos: vec(620, 440),
          targetRotation: R0
        }
      ]
    })
  )
}

export function createDemo8PuzzleState() {
  const pieces = [...base6, ...extra2, ...extra4] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 14,
        angleRad: 0.2,
        magnetDistancePx: 32,
        magnetAngleRad: 0.4,
        magnetStrength: 0.2
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(120, 390),
          startRotation: 0.6,
          targetPos: vec(200, 140),
          targetRotation: R90
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(690, 140),
          startRotation: -0.6,
          targetPos: vec(350, 140),
          targetRotation: R0
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(640, 380),
          startRotation: 1.0,
          targetPos: vec(520, 140),
          targetRotation: R180
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(330, 70),
          startRotation: 2.2,
          targetPos: vec(240, 270),
          targetRotation: R270
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(150, 120),
          startRotation: -1.4,
          targetPos: vec(420, 270),
          targetRotation: R0
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(510, 70),
          startRotation: 0.2,
          targetPos: vec(600, 270),
          targetRotation: R90
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 300),
          startRotation: -1.1,
          targetPos: vec(300, 390),
          targetRotation: R180
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(60, 260),
          startRotation: 1.3,
          targetPos: vec(500, 390),
          targetRotation: R270
        },
        {
          id: pieces[8].id,
          size: { w: pieces[8].w, h: pieces[8].h },
          startPos: vec(720, 70),
          startRotation: -0.2,
          targetPos: vec(260, 460),
          targetRotation: R90
        },
        {
          id: pieces[9].id,
          size: { w: pieces[9].w, h: pieces[9].h },
          startPos: vec(80, 70),
          startRotation: 0.7,
          targetPos: vec(560, 460),
          targetRotation: R0
        }
      ]
    })
  )
}

export function createDemo9PuzzleState() {
  const pieces = [...base6, ...extra2, ...extra4] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 14,
        angleRad: 0.2,
        magnetDistancePx: 32,
        magnetAngleRad: 0.4,
        magnetStrength: 0.2
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(120, 390),
          startRotation: -0.4,
          targetPos: vec(240, 150),
          targetRotation: R180
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(690, 140),
          startRotation: 0.9,
          targetPos: vec(420, 150),
          targetRotation: R90
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(580, 150),
          targetRotation: R270
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(330, 70),
          startRotation: 2.3,
          targetPos: vec(260, 300),
          targetRotation: R0
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(150, 120),
          startRotation: -1.2,
          targetPos: vec(460, 300),
          targetRotation: R180
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(510, 70),
          startRotation: 0.1,
          targetPos: vec(640, 300),
          targetRotation: R270
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 260),
          startRotation: -0.8,
          targetPos: vec(300, 430),
          targetRotation: R90
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(70, 250),
          startRotation: 0.9,
          targetPos: vec(500, 430),
          targetRotation: R0
        },
        {
          id: pieces[8].id,
          size: { w: pieces[8].w, h: pieces[8].h },
          startPos: vec(720, 70),
          startRotation: 0.4,
          targetPos: vec(220, 460),
          targetRotation: R180
        },
        {
          id: pieces[9].id,
          size: { w: pieces[9].w, h: pieces[9].h },
          startPos: vec(80, 70),
          startRotation: -0.4,
          targetPos: vec(620, 460),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo10PuzzleState() {
  const pieces = [...base6, ...extra2, ...extra4, ...extra6] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 12,
        angleRad: 0.18,
        magnetDistancePx: 28,
        magnetAngleRad: 0.38,
        magnetStrength: 0.18
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(120, 390),
          startRotation: 0.6,
          targetPos: vec(190, 130),
          targetRotation: R90
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(690, 140),
          startRotation: -0.6,
          targetPos: vec(330, 130),
          targetRotation: R0
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(640, 380),
          startRotation: 1.0,
          targetPos: vec(490, 130),
          targetRotation: R180
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(330, 70),
          startRotation: 2.2,
          targetPos: vec(210, 260),
          targetRotation: R270
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(150, 120),
          startRotation: -1.4,
          targetPos: vec(400, 260),
          targetRotation: R0
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(510, 70),
          startRotation: 0.2,
          targetPos: vec(580, 260),
          targetRotation: R90
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 300),
          startRotation: -1.1,
          targetPos: vec(290, 390),
          targetRotation: R180
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(60, 260),
          startRotation: 1.3,
          targetPos: vec(470, 390),
          targetRotation: R270
        },
        {
          id: pieces[8].id,
          size: { w: pieces[8].w, h: pieces[8].h },
          startPos: vec(720, 70),
          startRotation: -0.2,
          targetPos: vec(230, 470),
          targetRotation: R90
        },
        {
          id: pieces[9].id,
          size: { w: pieces[9].w, h: pieces[9].h },
          startPos: vec(80, 70),
          startRotation: 0.7,
          targetPos: vec(420, 470),
          targetRotation: R0
        },
        {
          id: pieces[10].id,
          size: { w: pieces[10].w, h: pieces[10].h },
          startPos: vec(760, 220),
          startRotation: 0.1,
          targetPos: vec(560, 470),
          targetRotation: R180
        },
        {
          id: pieces[11].id,
          size: { w: pieces[11].w, h: pieces[11].h },
          startPos: vec(60, 220),
          startRotation: -0.9,
          targetPos: vec(680, 470),
          targetRotation: R270
        }
      ]
    })
  )
}

export function createDemo11PuzzleState() {
  const pieces = [...base6, ...extra2, ...extra4, ...extra6] as const
  return buildPuzzleState(
    make({
      snap: {
        distancePx: 12,
        angleRad: 0.18,
        magnetDistancePx: 28,
        magnetAngleRad: 0.38,
        magnetStrength: 0.18
      },
      pieces: [
        {
          id: pieces[0].id,
          size: { w: pieces[0].w, h: pieces[0].h },
          startPos: vec(120, 390),
          startRotation: -0.5,
          targetPos: vec(240, 150),
          targetRotation: R180
        },
        {
          id: pieces[1].id,
          size: { w: pieces[1].w, h: pieces[1].h },
          startPos: vec(690, 140),
          startRotation: 0.9,
          targetPos: vec(420, 150),
          targetRotation: R90
        },
        {
          id: pieces[2].id,
          size: { w: pieces[2].w, h: pieces[2].h },
          startPos: vec(640, 380),
          startRotation: 1.2,
          targetPos: vec(580, 150),
          targetRotation: R270
        },
        {
          id: pieces[3].id,
          size: { w: pieces[3].w, h: pieces[3].h },
          startPos: vec(330, 70),
          startRotation: 2.3,
          targetPos: vec(260, 300),
          targetRotation: R0
        },
        {
          id: pieces[4].id,
          size: { w: pieces[4].w, h: pieces[4].h },
          startPos: vec(150, 120),
          startRotation: -1.2,
          targetPos: vec(460, 300),
          targetRotation: R180
        },
        {
          id: pieces[5].id,
          size: { w: pieces[5].w, h: pieces[5].h },
          startPos: vec(520, 80),
          startRotation: 0.2,
          targetPos: vec(660, 300),
          targetRotation: R180
        },
        {
          id: pieces[6].id,
          size: { w: pieces[6].w, h: pieces[6].h },
          startPos: vec(760, 260),
          startRotation: -1.1,
          targetPos: vec(300, 420),
          targetRotation: R90
        },
        {
          id: pieces[7].id,
          size: { w: pieces[7].w, h: pieces[7].h },
          startPos: vec(70, 250),
          startRotation: 0.9,
          targetPos: vec(480, 420),
          targetRotation: R0
        },
        {
          id: pieces[8].id,
          size: { w: pieces[8].w, h: pieces[8].h },
          startPos: vec(720, 70),
          startRotation: 0.4,
          targetPos: vec(230, 460),
          targetRotation: R270
        },
        {
          id: pieces[9].id,
          size: { w: pieces[9].w, h: pieces[9].h },
          startPos: vec(80, 70),
          startRotation: -0.4,
          targetPos: vec(600, 460),
          targetRotation: R180
        },
        {
          id: pieces[10].id,
          size: { w: pieces[10].w, h: pieces[10].h },
          startPos: vec(760, 220),
          startRotation: -0.2,
          targetPos: vec(360, 460),
          targetRotation: R90
        },
        {
          id: pieces[11].id,
          size: { w: pieces[11].w, h: pieces[11].h },
          startPos: vec(60, 220),
          startRotation: 1.0,
          targetPos: vec(540, 460),
          targetRotation: R0
        }
      ]
    })
  )
}
