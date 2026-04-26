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

export function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function smoothstep(t: number): number {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}
