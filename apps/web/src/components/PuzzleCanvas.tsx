"use client"

import { useEffect, useMemo, useRef } from "react"

import { angleDiff, clamp01, lerp, smoothstep, snapSatisfied } from "@/lib/puzzle/geom"
import { toLocalRects } from "@/lib/puzzle/shapes"
import { bumpZ, findPiece, snapshotPiece, type Piece, type PuzzleState } from "@/lib/puzzle/state"
import { captureMoveRotate, recordAction, type UndoState } from "@/lib/puzzle/undo"
import { dist, sub, type Vec2, vec } from "@/lib/puzzle/vec2"

function getCanvasPoint(canvas: HTMLCanvasElement, e: PointerEvent): Vec2 {
  const rect = canvas.getBoundingClientRect()
  return vec(e.clientX - rect.left, e.clientY - rect.top)
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2))
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawPiece(ctx: CanvasRenderingContext2D, piece: Piece) {
  ctx.save()
  ctx.translate(piece.pos.x, piece.pos.y)
  ctx.rotate(piece.rotation)

  const rects = toLocalRects(piece.shape)

  ctx.fillStyle = piece.locked ? "rgba(180, 150, 110, 0.45)" : "rgba(180, 150, 110, 0.75)"
  ctx.strokeStyle = "rgba(60, 40, 20, 0.35)"
  ctx.lineWidth = 2

  ctx.beginPath()
  for (const r of rects) {
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 10)
  }
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

function drawTarget(ctx: CanvasRenderingContext2D, piece: Piece) {
  ctx.save()
  ctx.translate(piece.targetPos.x, piece.targetPos.y)
  ctx.rotate(piece.targetRotation)

  const rects = toLocalRects(piece.shape)

  ctx.strokeStyle = "rgba(0, 0, 0, 0.18)"
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 6])

  ctx.beginPath()
  for (const r of rects) {
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 10)
  }
  ctx.stroke()

  ctx.restore()
}

function rotatePoint(pt: Vec2, angle: number): Vec2 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return vec(pt.x * c - pt.y * s, pt.x * s + pt.y * c)
}

function pointInRect(pt: Vec2, r: { x: number; y: number; w: number; h: number }): boolean {
  return pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h
}

function cloneState(state: PuzzleState): PuzzleState {
  return {
    board: { ...state.board },
    snap: { ...state.snap },
    activePieceId: state.activePieceId,
    pieces: state.pieces.map((p) => ({
      ...p,
      pos: { ...p.pos },
      targetPos: { ...p.targetPos },
      shape: { ...p.shape }
    }))
  }
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
        const local = rotatePoint(sub(pt, p.pos), -p.rotation)
        const rects = toLocalRects(p.shape)
        for (const r of rects) {
          if (pointInRect(local, r)) return p
        }
      }
      return null
    }

    const onPointerDown = (e: PointerEvent) => {
      const pt = getCanvasPoint(canvas, e)
      const hit = pick(pt)
      if (!hit) return

      canvas.setPointerCapture(e.pointerId)

      const next = cloneState(state)
      bumpZ(next, hit.id)
      next.activePieceId = hit.id
      onStateChange(next)

      const piece = findPiece(next, hit.id)
      if (!piece) return

      dragRef.current.activeId = hit.id
      dragRef.current.beforeSnap = snapshotPiece(piece)

      dragRef.current.dragOffsetLocal = sub(pt, piece.pos)
      dragRef.current.rotateStartAngle = null
      dragRef.current.rotateStartRotation = null
    }

    const onPointerMove = (e: PointerEvent) => {
      const activeId = dragRef.current.activeId
      if (!activeId) return

      const next = cloneState(state)
      const piece = findPiece(next, activeId)
      if (!piece) return

      const pt = getCanvasPoint(canvas, e)

      if (e.altKey) {
        const v = sub(pt, piece.pos)
        const angle = Math.atan2(v.y, v.x)

        if (
          dragRef.current.rotateStartAngle == null ||
          dragRef.current.rotateStartRotation == null
        ) {
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
        const rawPos = vec(pt.x - offset.x, pt.y - offset.y)
        piece.pos = rawPos

        const cfg = next.snap
        const d = dist(piece.pos, piece.targetPos)
        const a = angleDiff(piece.rotation, piece.targetRotation)

        if (d <= cfg.magnetDistancePx && a <= cfg.magnetAngleRad) {
          const t = 1 - clamp01(d / cfg.magnetDistancePx)
          const w = smoothstep(t) * cfg.magnetStrength
          piece.pos = {
            x: lerp(piece.pos.x, piece.targetPos.x, w),
            y: lerp(piece.pos.y, piece.targetPos.y, w)
          }
        }
      }

      onStateChange(next)
    }

    const onPointerUp = () => {
      const activeId = dragRef.current.activeId
      if (!activeId) return
      dragRef.current.activeId = null

      const next = cloneState(state)
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
