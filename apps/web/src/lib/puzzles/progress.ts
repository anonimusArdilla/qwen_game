export const progressStorageKey = "woodenPuzzles.progress.v1"

export type PuzzleProgress = {
  completed: boolean
  bestTimeMs?: number
  bestMoves?: number
}

export type ProgressMap = Record<string, PuzzleProgress>

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(progressStorageKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as ProgressMap
  } catch {
    return {}
  }
}

export function saveProgress(map: ProgressMap) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(progressStorageKey, JSON.stringify(map))
}

export function mergeResult(
  map: ProgressMap,
  puzzleId: string,
  result: { timeMs: number; moves: number }
): ProgressMap {
  const current = map[puzzleId] ?? { completed: false }
  const next: PuzzleProgress = {
    completed: true,
    bestTimeMs:
      current.bestTimeMs == null ? result.timeMs : Math.min(current.bestTimeMs, result.timeMs),
    bestMoves: current.bestMoves == null ? result.moves : Math.min(current.bestMoves, result.moves)
  }

  return { ...map, [puzzleId]: next }
}
