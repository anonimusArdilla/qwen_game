import { type PieceRectLocal, type PieceShape } from "@/lib/puzzle/state"

export function rectShape(w: number, h: number): PieceShape {
  return { kind: "rect", w, h }
}

export function toLocalRects(shape: PieceShape): PieceRectLocal[] {
  if (shape.kind === "rect") {
    return [{ x: -shape.w / 2, y: -shape.h / 2, w: shape.w, h: shape.h }]
  }
  return shape.rects
}

export type Cell = { x: number; y: number }

export function polyominoShape(cells: readonly Cell[], cellSize: number): PieceShape {
  const rects = cells.map((c) => ({
    x: c.x * cellSize,
    y: c.y * cellSize,
    w: cellSize,
    h: cellSize
  }))

  const minX = Math.min(...rects.map((r) => r.x))
  const minY = Math.min(...rects.map((r) => r.y))
  const maxX = Math.max(...rects.map((r) => r.x + r.w))
  const maxY = Math.max(...rects.map((r) => r.y + r.h))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  const centered = rects.map((r) => ({ ...r, x: r.x - cx, y: r.y - cy }))
  return { kind: "compound", rects: centered }
}
