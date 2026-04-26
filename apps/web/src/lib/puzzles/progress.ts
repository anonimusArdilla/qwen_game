export const progressStorageKey = "woodenPuzzles.progress.v1"

const puzzleIdRenameMap: Record<string, string> = {
  "demo-1": "starter-six",
  "demo-2": "diagonal-six",
  "demo-3": "cascade-six",
  "demo-4": "cross-six",
  "demo-5": "stack-eight",
  "demo-6": "stagger-eight",
  "demo-7": "split-eight",
  "demo-8": "drift-ten",
  "demo-9": "orbit-ten",
  "demo-10": "dense-twelve-a",
  "demo-11": "dense-twelve-b"
}

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
    const map = parsed as ProgressMap
    let changed = false

    for (const [oldId, newId] of Object.entries(puzzleIdRenameMap)) {
      const oldVal = map[oldId]
      if (!oldVal) continue

      if (map[newId] == null) {
        map[newId] = oldVal
        changed = true
      }
      delete map[oldId]
      changed = true
    }

    if (changed) {
      window.localStorage.setItem(progressStorageKey, JSON.stringify(map))
    }

    return map
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
