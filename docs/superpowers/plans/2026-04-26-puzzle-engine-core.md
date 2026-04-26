# Puzzle Engine Core (Phase 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first playable puzzle prototype using Canvas with free drag + free rotation + snap-to-target + undo/redo, reachable at `/[locale]/play`.

**Architecture:** Keep core puzzle math/state/undo as pure TypeScript modules under `src/lib/puzzle/*`. Build a single client component (`PuzzleCanvas`) that renders via `<canvas>` and translates pointer input into state updates. UI (toolbar, route, navigation) is thin and localized via existing next-intl setup.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind, next-intl, Canvas 2D.

---

## Files / Modules

Create:
- `apps/web/src/lib/puzzle/vec2.ts`
- `apps/web/src/lib/puzzle/geom.ts`
- `apps/web/src/lib/puzzle/state.ts`
- `apps/web/src/lib/puzzle/undo.ts`
- `apps/web/src/lib/puzzle/demo.ts`
- `apps/web/src/components/PuzzleCanvas.tsx`
- `apps/web/src/components/PlayView.tsx`
- `apps/web/scripts/puzzle-smoke.ts`
- `apps/web/src/app/[locale]/play/page.tsx`

Modify:
- `apps/web/package.json` (add `tsx` + `puzzle:smoke` script)
- `apps/web/src/components/AppShell.tsx` (add nav link to Play)
- `apps/web/src/i18n/messages/en.json`
- `apps/web/src/i18n/messages/es.json`
- `apps/web/src/i18n/messages/zh-CN.json`
- `apps/web/src/i18n/messages/ja.json`
- `apps/web/src/i18n/messages/ko.json`

---

### Task 1: Add vec2 + geometry helpers

**Files:**
- Create: `apps/web/src/lib/puzzle/vec2.ts`
- Create: `apps/web/src/lib/puzzle/geom.ts`

- [ ] **Step 1: Create vec2.ts**

Create `apps/web/src/lib/puzzle/vec2.ts`:

```ts
export type Vec2 = {
  x: number
  y: number
}

export function vec(x: number, y: number): Vec2 {
  return { x, y }
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function mul(a: Vec2, s: number): Vec2 {
  return { x: a.x * s, y: a.y * s }
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y
}

export function lenSq(a: Vec2): number {
  return dot(a, a)
}

export function len(a: Vec2): number {
  return Math.sqrt(lenSq(a))
}

export function dist(a: Vec2, b: Vec2): number {
  return len(sub(a, b))
}
```

- [ ] **Step 2: Create geom.ts**

Create `apps/web/src/lib/puzzle/geom.ts`:

```ts
import { dist, sub, type Vec2, vec } from "@/lib/puzzle/vec2"

export type OrientedRect = {
  center: Vec2
  half: Vec2
  rotation: number
}

export function normalizeAngle(rad: number): number {
  let a = rad % (Math.PI * 2)
  if (a <= -Math.PI) a += Math.PI * 2
  if (a > Math.PI) a -= Math.PI * 2
  return a
}

export function angleDiff(a: number, b: number): number {
  return Math.abs(normalizeAngle(a - b))
}

export function rotate(p: Vec2, rad: number): Vec2 {
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c }
}

export function inverseRotate(p: Vec2, rad: number): Vec2 {
  return rotate(p, -rad)
}

export function worldToLocal(point: Vec2, rect: OrientedRect): Vec2 {
  return inverseRotate(sub(point, rect.center), rect.rotation)
}

export function localToWorld(point: Vec2, rect: OrientedRect): Vec2 {
  return vec(
    rect.center.x + point.x * Math.cos(rect.rotation) - point.y * Math.sin(rect.rotation),
    rect.center.y + point.x * Math.sin(rect.rotation) + point.y * Math.cos(rect.rotation)
  )
}

export function hitTestOrientedRect(point: Vec2, rect: OrientedRect): boolean {
  const p = worldToLocal(point, rect)
  return Math.abs(p.x) <= rect.half.x && Math.abs(p.y) <= rect.half.y
}

export function snapSatisfied(args: {
  pos: Vec2
  targetPos: Vec2
  rotation: number
  targetRotation: number
  maxDist: number
  maxAngle: number
}): boolean {
  const okDist = dist(args.pos, args.targetPos) <= args.maxDist
  const okAngle = angleDiff(args.rotation, args.targetRotation) <= args.maxAngle
  return okDist && okAngle
}
```

---

### Task 2: Add puzzle state + undo stack

**Files:**
- Create: `apps/web/src/lib/puzzle/state.ts`
- Create: `apps/web/src/lib/puzzle/undo.ts`

- [ ] **Step 1: Create state.ts**

Create `apps/web/src/lib/puzzle/state.ts`:

```ts
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
```

- [ ] **Step 2: Create undo.ts**

Create `apps/web/src/lib/puzzle/undo.ts`:

```ts
import { applySnapshot, findPiece, snapshotPiece, type PieceSnapshot, type PuzzleState } from "./state"

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

export function canUndo(undo: UndoState): boolean {
  return undo.past.length > 0
}

export function canRedo(undo: UndoState): boolean {
  return undo.future.length > 0
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

export function captureMoveRotate(state: PuzzleState, pieceId: string, before: PieceSnapshot): PuzzleAction {
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
```

---

### Task 3: Add a minimal demo puzzle

**Files:**
- Create: `apps/web/src/lib/puzzle/demo.ts`

- [ ] **Step 1: Create demo.ts**

Create `apps/web/src/lib/puzzle/demo.ts`:

```ts
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
```

---

### Task 4: Implement PuzzleCanvas (render + input)

**Files:**
- Create: `apps/web/src/components/PuzzleCanvas.tsx`

- [ ] **Step 1: Create PuzzleCanvas.tsx**

Create `apps/web/src/components/PuzzleCanvas.tsx`:

```tsx
"use client"

import { useEffect, useMemo, useRef } from "react"

import { hitTestOrientedRect, snapSatisfied } from "@/lib/puzzle/geom"
import { applySnapshot, bumpZ, findPiece, snapshotPiece, type Piece, type PuzzleState } from "@/lib/puzzle/state"
import { captureMoveRotate, recordAction, type UndoState } from "@/lib/puzzle/undo"
import { dist, sub, type Vec2, vec } from "@/lib/puzzle/vec2"

function getCanvasPoint(canvas: HTMLCanvasElement, e: PointerEvent): Vec2 {
  const rect = canvas.getBoundingClientRect()
  return vec(e.clientX - rect.left, e.clientY - rect.top)
}

function drawPiece(ctx: CanvasRenderingContext2D, piece: Piece) {
  ctx.save()
  ctx.translate(piece.pos.x, piece.pos.y)
  ctx.rotate(piece.rotation)

  const w = piece.shape.w
  const h = piece.shape.h

  ctx.fillStyle = piece.locked ? "rgba(180, 150, 110, 0.45)" : "rgba(180, 150, 110, 0.75)"
  ctx.strokeStyle = "rgba(60, 40, 20, 0.35)"
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.roundRect(-w / 2, -h / 2, w, h, 10)
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

function drawTarget(ctx: CanvasRenderingContext2D, piece: Piece) {
  ctx.save()
  ctx.translate(piece.targetPos.x, piece.targetPos.y)
  ctx.rotate(piece.targetRotation)

  const w = piece.shape.w
  const h = piece.shape.h

  ctx.strokeStyle = "rgba(0, 0, 0, 0.18)"
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 6])

  ctx.beginPath()
  ctx.roundRect(-w / 2, -h / 2, w, h, 10)
  ctx.stroke()

  ctx.restore()
}

export function PuzzleCanvas({
  state,
  undo,
  onStateChange
}: {
  state: PuzzleState
  undo: UndoState
  onStateChange: (next: PuzzleState) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const dragRef = useRef<{
    activeId: string | null
    beforeSnap: ReturnType<typeof snapshotPiece> | null
    dragOffsetLocal: Vec2 | null
    rotateStartAngle: number | null
    rotateStartRotation: number | null
  }>({
    activeId: null,
    beforeSnap: null,
    dragOffsetLocal: null,
    rotateStartAngle: null,
    rotateStartRotation: null
  })

  const orderedPieces = useMemo(() => {
    return [...state.pieces].sort((a, b) => a.z - b.z)
  }, [state.pieces])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = state.board.width
    const height = state.board.height

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, width, height)

      for (const p of orderedPieces) {
        if (!p.locked) drawTarget(ctx, p)
      }

      for (const p of orderedPieces) {
        drawPiece(ctx, p)
      }

      raf = window.requestAnimationFrame(render)
    }

    raf = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(raf)
  }, [orderedPieces, state.board.height, state.board.width])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pick = (pt: Vec2): Piece | null => {
      const sorted = [...state.pieces].sort((a, b) => b.z - a.z)
      for (const p of sorted) {
        if (p.locked) continue
        const rect = {
          center: p.pos,
          half: { x: p.shape.w / 2, y: p.shape.h / 2 },
          rotation: p.rotation
        }
        if (hitTestOrientedRect(pt, rect)) return p
      }
      return null
    }

    const onPointerDown = (e: PointerEvent) => {
      const pt = getCanvasPoint(canvas, e)
      const hit = pick(pt)
      if (!hit) return

      canvas.setPointerCapture(e.pointerId)

      const next = structuredClone(state) as PuzzleState
      bumpZ(next, hit.id)
      next.activePieceId = hit.id
      onStateChange(next)

      const piece = findPiece(next, hit.id)
      if (!piece) return

      dragRef.current.activeId = hit.id
      dragRef.current.beforeSnap = snapshotPiece(piece)

      const local = sub(pt, piece.pos)
      dragRef.current.dragOffsetLocal = local
      dragRef.current.rotateStartAngle = null
      dragRef.current.rotateStartRotation = null
    }

    const onPointerMove = (e: PointerEvent) => {
      const activeId = dragRef.current.activeId
      if (!activeId) return

      const next = structuredClone(state) as PuzzleState
      const piece = findPiece(next, activeId)
      if (!piece) return

      const pt = getCanvasPoint(canvas, e)

      if (e.altKey) {
        const center = piece.pos
        const v = sub(pt, center)
        const angle = Math.atan2(v.y, v.x)

        if (dragRef.current.rotateStartAngle == null || dragRef.current.rotateStartRotation == null) {
          dragRef.current.rotateStartAngle = angle
          dragRef.current.rotateStartRotation = piece.rotation
        } else {
          const delta = angle - dragRef.current.rotateStartAngle
          piece.rotation = dragRef.current.rotateStartRotation + delta
        }
      } else {
        dragRef.current.rotateStartAngle = null
        dragRef.current.rotateStartRotation = null

        const offset = dragRef.current.dragOffsetLocal ?? vec(0, 0)
        piece.pos = vec(pt.x - offset.x, pt.y - offset.y)
      }

      onStateChange(next)
    }

    const onPointerUp = (e: PointerEvent) => {
      const activeId = dragRef.current.activeId
      if (!activeId) return
      dragRef.current.activeId = null

      const next = structuredClone(state) as PuzzleState
      const piece = findPiece(next, activeId)
      if (!piece) return

      const before = dragRef.current.beforeSnap
      dragRef.current.beforeSnap = null

      const shouldSnap = snapSatisfied({
        pos: piece.pos,
        targetPos: piece.targetPos,
        rotation: piece.rotation,
        targetRotation: piece.targetRotation,
        maxDist: next.snap.distancePx,
        maxAngle: next.snap.angleRad
      })

      if (shouldSnap) {
        piece.pos = { ...piece.targetPos }
        piece.rotation = piece.targetRotation
        piece.locked = true
      }

      next.activePieceId = null
      onStateChange(next)

      if (before) {
        const action = captureMoveRotate(next, activeId, before)
        if (
          dist(action.before.pos, action.after.pos) > 0.001 ||
          Math.abs(action.before.rotation - action.after.rotation) > 0.001 ||
          action.before.locked !== action.after.locked
        ) {
          recordAction(undo, action)
        }
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerup", onPointerUp)
    canvas.addEventListener("pointercancel", onPointerUp)

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerup", onPointerUp)
      canvas.removeEventListener("pointercancel", onPointerUp)
    }
  }, [onStateChange, state, undo])

  return (
    <div className="bg-surface border-border/10 overflow-hidden rounded-lg border shadow-sm">
      <canvas ref={canvasRef} />
    </div>
  )
}
```

---

### Task 5: Add /play route + toolbar + navigation + i18n strings

**Files:**
- Create: `apps/web/src/components/PlayView.tsx`
- Create: `apps/web/src/app/[locale]/play/page.tsx`
- Modify: `apps/web/src/components/AppShell.tsx`
- Modify: `apps/web/src/i18n/messages/*.json`

- [ ] **Step 1: Create PlayView**

Create `apps/web/src/components/PlayView.tsx`:

```tsx
"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import { PuzzleCanvas } from "@/components/PuzzleCanvas"
import { createDemoPuzzleState } from "@/lib/puzzle/demo"
import { createUndoState, redoOnce, undoOnce } from "@/lib/puzzle/undo"
import { type PuzzleState } from "@/lib/puzzle/state"

export function PlayView() {
  const t = useTranslations("play")

  const undo = useMemo(() => createUndoState(100), [])
  const [state, setState] = useState<PuzzleState>(() => createDemoPuzzleState())

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
          onClick={() => {
            undoOnce(state, undo)
            setState({ ...state })
          }}
        >
          {t("toolbar.undo")}
        </button>
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
          onClick={() => {
            redoOnce(state, undo)
            setState({ ...state })
          }}
        >
          {t("toolbar.redo")}
        </button>
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
          onClick={() => {
            undo.past = []
            undo.future = []
            setState(createDemoPuzzleState())
          }}
        >
          {t("toolbar.reset")}
        </button>
        <div className="text-muted ml-auto text-sm">{t("hint")}</div>
      </div>

      <PuzzleCanvas state={state} undo={undo} onStateChange={setState} />
    </div>
  )
}
```

- [ ] **Step 2: Create /play page**

Create `apps/web/src/app/[locale]/play/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server"

import { PlayView } from "@/components/PlayView"
import { type Locale } from "@/i18n/routing"

export default async function PlayPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PlayView />
}
```

- [ ] **Step 3: Add navigation link in AppShell**

Update `apps/web/src/components/AppShell.tsx` to:
- import `Link` from `@/i18n/navigation`
- render a `Play` link in the header

Target header right area should become:

```tsx
<div className="flex items-center gap-4">
  <Link href="/play" className="text-muted hover:text-fg text-sm">
    {tNav("play")}
  </Link>
  <LocaleSwitcher />
  <ThemeSwitcher />
</div>
```

Also load `tNav`:

```tsx
const tNav = await getTranslations({ locale, namespace: "nav" })
```

- [ ] **Step 4: Add i18n keys**

Update each messages file with:

English (`apps/web/src/i18n/messages/en.json`):

```json
{
  "nav": { "play": "Play" },
  "play": {
    "toolbar.undo": "Undo",
    "toolbar.redo": "Redo",
    "toolbar.reset": "Reset",
    "hint": "Drag to move · Hold Alt and drag to rotate"
  }
}
```

Spanish:

```json
{
  "nav": { "play": "Jugar" },
  "play": {
    "toolbar.undo": "Deshacer",
    "toolbar.redo": "Rehacer",
    "toolbar.reset": "Reiniciar",
    "hint": "Arrastra para mover · Mantén Alt y arrastra para rotar"
  }
}
```

Chinese (Simplified):

```json
{
  "nav": { "play": "开始" },
  "play": {
    "toolbar.undo": "撤销",
    "toolbar.redo": "重做",
    "toolbar.reset": "重置",
    "hint": "拖动移动 · 按住 Alt 并拖动旋转"
  }
}
```

Japanese:

```json
{
  "nav": { "play": "プレイ" },
  "play": {
    "toolbar.undo": "元に戻す",
    "toolbar.redo": "やり直し",
    "toolbar.reset": "リセット",
    "hint": "ドラッグで移動 · Alt を押しながらドラッグで回転"
  }
}
```

Korean:

```json
{
  "nav": { "play": "플레이" },
  "play": {
    "toolbar.undo": "실행 취소",
    "toolbar.redo": "다시 실행",
    "toolbar.reset": "초기화",
    "hint": "드래그로 이동 · Alt 누른 채 드래그로 회전"
  }
}
```

Merge these objects into the existing JSON (do not delete existing keys).

---

### Task 6: Add a smoke-check script (no framework)

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/scripts/puzzle-smoke.ts`

- [ ] **Step 1: Add tsx + script**

Run:

```bash
cd /workspace/apps/web
npm install -D tsx@4.21.0
```

Update `apps/web/package.json`:
- Add devDependency: `"tsx": "4.21.0"`
- Add script: `"puzzle:smoke": "tsx scripts/puzzle-smoke.ts"`

- [ ] **Step 2: Create puzzle-smoke.ts**

Create `apps/web/scripts/puzzle-smoke.ts`:

```ts
import assert from "node:assert/strict"

import { angleDiff } from "@/lib/puzzle/geom"
import { createDemoPuzzleState } from "@/lib/puzzle/demo"
import { snapshotPiece } from "@/lib/puzzle/state"
import { captureMoveRotate, createUndoState, recordAction, undoOnce } from "@/lib/puzzle/undo"

assert.ok(angleDiff(Math.PI * 2, 0) < 1e-9)
assert.ok(angleDiff(Math.PI * 0.1, -Math.PI * 1.9) < 1e-6)

const state = createDemoPuzzleState()
const undo = createUndoState()

const p = state.pieces[0]
const before = snapshotPiece(p)
p.pos.x += 10
p.rotation += 0.1

recordAction(undo, captureMoveRotate(state, p.id, before))
undoOnce(state, undo)

assert.equal(state.pieces[0].pos.x, before.pos.x)
assert.equal(state.pieces[0].pos.y, before.pos.y)

console.log("puzzle-smoke: ok")
```

---

### Task 7: Verification

- [ ] **Step 1: Format + lint + typecheck**

Run:

```bash
cd /workspace/apps/web
npm run format:check
npm run lint
npm run typecheck
```

- [ ] **Step 2: Run smoke check**

Run:

```bash
cd /workspace/apps/web
npm run puzzle:smoke
```

Expected output:
`puzzle-smoke: ok`

- [ ] **Step 3: Run dev + manual checks**

Run:

```bash
cd /workspace/apps/web
npm run dev
```

Manual checks:
- Open `/en/play`
- Drag pieces to move
- Hold `Alt` and drag to rotate
- Release near target: snaps and locks
- Locked pieces cannot be dragged
- Undo/redo works (transform + locked state)
- Reset restores initial positions

