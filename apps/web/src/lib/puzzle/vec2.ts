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
