# Multi-Puzzle + Local Progress (Phase 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a puzzle catalog with a picker at `/[locale]/play`, a per-puzzle playable route `/[locale]/play/[puzzleId]`, and local progress saving (completed + best time + best moves).

**Architecture:** Define puzzle content as a catalog (`src/lib/puzzles/catalog.ts`) with `createInitialState()` factories returning `PuzzleState`. Add a client progress module (`src/lib/puzzles/progress.ts`) that persists a versioned progress map in `localStorage`. Update the play UI into two pages: picker (server) and playable view (client), with completion detection based on `pieces.every(p => p.locked)`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind, next-intl, localStorage.

---

## Files / Modules

Create:
- `apps/web/src/lib/puzzles/catalog.ts`
- `apps/web/src/lib/puzzles/progress.ts`
- `apps/web/src/lib/puzzles/format.ts`
- `apps/web/src/components/PuzzlePicker.tsx`
- `apps/web/src/components/PuzzleHud.tsx`
- `apps/web/src/app/[locale]/play/page.tsx`
- `apps/web/src/app/[locale]/play/[puzzleId]/page.tsx`

Modify:
- `apps/web/src/components/PlayView.tsx`
- `apps/web/src/i18n/messages/en.json`
- `apps/web/src/i18n/messages/es.json`
- `apps/web/src/i18n/messages/zh-CN.json`
- `apps/web/src/i18n/messages/ja.json`
- `apps/web/src/i18n/messages/ko.json`

---

### Task 1: Add puzzle catalog

**Files:**
- Create: `apps/web/src/lib/puzzles/catalog.ts`

- [ ] **Step 1: Create catalog.ts**

Create `apps/web/src/lib/puzzles/catalog.ts`:

```ts
import { createDemoPuzzleState } from "@/lib/puzzle/demo"
import { type PuzzleState } from "@/lib/puzzle/state"

export type PuzzleDefinition = {
  id: string
  titleKey: string
  createInitialState: () => PuzzleState
}

export const puzzles: readonly PuzzleDefinition[] = [
  {
    id: "demo-1",
    titleKey: "puzzles.demo1.title",
    createInitialState: createDemoPuzzleState
  }
]

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
  return puzzles.find((p) => p.id === id)
}
```

---

### Task 2: Add local progress module

**Files:**
- Create: `apps/web/src/lib/puzzles/progress.ts`

- [ ] **Step 1: Create progress.ts**

Create `apps/web/src/lib/puzzles/progress.ts`:

```ts
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
    bestMoves:
      current.bestMoves == null ? result.moves : Math.min(current.bestMoves, result.moves)
  }

  return { ...map, [puzzleId]: next }
}
```

---

### Task 3: Add formatting helper for mm:ss

**Files:**
- Create: `apps/web/src/lib/puzzles/format.ts`

- [ ] **Step 1: Create format.ts**

Create `apps/web/src/lib/puzzles/format.ts`:

```ts
export function formatDurationMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}
```

---

### Task 4: Puzzle picker UI and /play page

**Files:**
- Create: `apps/web/src/components/PuzzlePicker.tsx`
- Create: `apps/web/src/app/[locale]/play/page.tsx`

- [ ] **Step 1: Create PuzzlePicker.tsx**

Create `apps/web/src/components/PuzzlePicker.tsx`:

```tsx
"use client"

import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

import { Link } from "@/i18n/navigation"
import { puzzles } from "@/lib/puzzles/catalog"
import { formatDurationMs } from "@/lib/puzzles/format"
import { loadProgress, type ProgressMap } from "@/lib/puzzles/progress"

export function PuzzlePicker() {
  const tPlay = useTranslations("play")
  const tPuzzles = useTranslations("puzzles")
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const items = useMemo(() => {
    return puzzles.map((p) => {
      const prog = progress[p.id]
      return { puzzle: p, progress: prog }
    })
  }, [progress])

  return (
    <div className="space-y-4">
      <h1 className="text-fg text-2xl font-semibold">{tPlay("puzzlesTitle")}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ puzzle, progress }) => (
          <Link
            key={puzzle.id}
            href={`/play/${puzzle.id}`}
            className="bg-surface border-border/10 hover:border-border/20 rounded-lg border p-4 shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-fg text-sm font-medium">{tPuzzles(puzzle.titleKey)}</div>
                <div className="text-muted text-sm">
                  {progress?.completed ? tPlay("completed") : tPlay("notCompleted")}
                </div>
              </div>
              {progress?.completed ? (
                <span className="bg-surface-2 text-fg rounded-full px-2 py-1 text-xs">
                  {tPlay("badgeCompleted")}
                </span>
              ) : null}
            </div>

            {progress?.completed ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted">
                  {tPlay("bestTime")}{" "}
                  <span className="text-fg">
                    {progress.bestTimeMs != null ? formatDurationMs(progress.bestTimeMs) : "—"}
                  </span>
                </div>
                <div className="text-muted text-right">
                  {tPlay("bestMoves")}{" "}
                  <span className="text-fg">{progress.bestMoves != null ? progress.bestMoves : "—"}</span>
                </div>
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create /play picker page**

Create `apps/web/src/app/[locale]/play/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server"

import { PuzzlePicker } from "@/components/PuzzlePicker"
import { type Locale } from "@/i18n/routing"

export default async function PlayPickerPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PuzzlePicker />
}
```

---

### Task 5: Playable page /play/[puzzleId] + HUD + completion persistence

**Files:**
- Create: `apps/web/src/components/PuzzleHud.tsx`
- Create: `apps/web/src/app/[locale]/play/[puzzleId]/page.tsx`
- Modify: `apps/web/src/components/PlayView.tsx`

- [ ] **Step 1: Create PuzzleHud.tsx**

Create `apps/web/src/components/PuzzleHud.tsx`:

```tsx
"use client"

import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { formatDurationMs } from "@/lib/puzzles/format"

export function PuzzleHud({
  puzzleTitle,
  elapsedMs,
  moves,
  completed,
  onReset
}: {
  puzzleTitle: string
  elapsedMs: number
  moves: number
  completed: boolean
  onReset: () => void
}) {
  const t = useTranslations("play")

  return (
    <div className="bg-surface border-border/10 rounded-lg border p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-fg text-sm font-medium">{puzzleTitle}</div>
        <div className="text-muted text-sm">
          {t("time")}: <span className="text-fg">{formatDurationMs(elapsedMs)}</span>
        </div>
        <div className="text-muted text-sm">
          {t("moves")}: <span className="text-fg">{moves}</span>
        </div>
        {completed ? (
          <span className="bg-surface-2 text-fg rounded-full px-2 py-1 text-xs">{t("badgeCompleted")}</span>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <Link href="/play" className="text-muted hover:text-fg text-sm">
            {t("back")}
          </Link>
          <button
            type="button"
            className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
            onClick={onReset}
          >
            {t("toolbar.reset")}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create /play/[puzzleId] server page**

Create `apps/web/src/app/[locale]/play/[puzzleId]/page.tsx`:

```tsx
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { PlayView } from "@/components/PlayView"
import { getPuzzleById } from "@/lib/puzzles/catalog"
import { type Locale } from "@/i18n/routing"

export default async function PuzzlePlayPage({
  params
}: {
  params: Promise<{ locale: Locale; puzzleId: string }>
}) {
  const { locale, puzzleId } = await params
  setRequestLocale(locale)

  const puzzle = getPuzzleById(puzzleId)
  if (!puzzle) notFound()

  const tPuzzles = await getTranslations({ locale, namespace: "puzzles" })
  const title = tPuzzles(puzzle.titleKey)

  return <PlayView puzzleId={puzzle.id} puzzleTitle={title} />
}
```

- [ ] **Step 3: Update PlayView to accept puzzleId + load puzzle + track time/moves + persist completion**

Replace `apps/web/src/components/PlayView.tsx` with:

```tsx
"use client"

import { useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"

import { PuzzleCanvas } from "@/components/PuzzleCanvas"
import { PuzzleHud } from "@/components/PuzzleHud"
import { getPuzzleById } from "@/lib/puzzles/catalog"
import { loadProgress, mergeResult, saveProgress } from "@/lib/puzzles/progress"
import { type PuzzleState } from "@/lib/puzzle/state"
import { createUndoState, redoOnce, type UndoState, undoOnce } from "@/lib/puzzle/undo"

export function PlayView({ puzzleId, puzzleTitle }: { puzzleId: string; puzzleTitle: string }) {
  const t = useTranslations("play")
  const puzzle = useMemo(() => getPuzzleById(puzzleId), [puzzleId])

  const [undo, setUndo] = useState<UndoState>(() => createUndoState(100))
  const [state, setState] = useState<PuzzleState>(() => puzzle?.createInitialState() ?? (null as never))

  const startRef = useRef<number>(Date.now())
  const [elapsedMs, setElapsedMs] = useState(0)

  const completed = state.pieces.every((p) => p.locked)
  const moves = undo.past.length

  useEffect(() => {
    if (!puzzle) return
    const next = puzzle.createInitialState()
    setUndo(createUndoState(100))
    setState(next)
    startRef.current = Date.now()
    setElapsedMs(0)
  }, [puzzle])

  useEffect(() => {
    if (completed) return
    const id = window.setInterval(() => setElapsedMs(Date.now() - startRef.current), 250)
    return () => window.clearInterval(id)
  }, [completed])

  useEffect(() => {
    if (!completed) return
    const timeMs = Date.now() - startRef.current
    const map = loadProgress()
    const next = mergeResult(map, puzzleId, { timeMs, moves })
    saveProgress(next)
    setElapsedMs(timeMs)
  }, [completed, moves, puzzleId])

  if (!puzzle) {
    return <div className="text-muted">{t("missingPuzzle")}</div>
  }

  return (
    <div className="space-y-4">
      <PuzzleHud
        puzzleTitle={puzzleTitle}
        elapsedMs={elapsedMs}
        moves={moves}
        completed={completed}
        onReset={() => {
          setUndo(createUndoState(100))
          setState(puzzle.createInitialState())
          startRef.current = Date.now()
          setElapsedMs(0)
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm disabled:opacity-60"
          disabled={undo.past.length === 0}
          onClick={() => {
            undoOnce(state, undo)
            setState({ ...state, pieces: [...state.pieces] })
          }}
        >
          {t("toolbar.undo")}
        </button>
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm disabled:opacity-60"
          disabled={undo.future.length === 0}
          onClick={() => {
            redoOnce(state, undo)
            setState({ ...state, pieces: [...state.pieces] })
          }}
        >
          {t("toolbar.redo")}
        </button>
        <div className="text-muted ml-auto text-sm">{t("hint")}</div>
      </div>

      <PuzzleCanvas state={state} undo={undo} onStateChange={setState} />
    </div>
  )
}
```

---

### Task 6: Update i18n messages

**Files:**
- Modify: `apps/web/src/i18n/messages/en.json`
- Modify: `apps/web/src/i18n/messages/es.json`
- Modify: `apps/web/src/i18n/messages/zh-CN.json`
- Modify: `apps/web/src/i18n/messages/ja.json`
- Modify: `apps/web/src/i18n/messages/ko.json`

- [ ] **Step 1: Add keys (merge into existing JSON)**

Add:
- `puzzles.demo1.title`
- `play.puzzlesTitle`, `play.completed`, `play.notCompleted`, `play.badgeCompleted`
- `play.bestTime`, `play.bestMoves`, `play.time`, `play.moves`, `play.back`, `play.missingPuzzle`

Example English snippet:

```json
{
  "puzzles": { "demo1": { "title": "Demo Puzzle" } },
  "play": {
    "puzzlesTitle": "Puzzles",
    "completed": "Completed",
    "notCompleted": "Not completed",
    "badgeCompleted": "Completed",
    "bestTime": "Best time",
    "bestMoves": "Best moves",
    "time": "Time",
    "moves": "Moves",
    "back": "Back",
    "missingPuzzle": "Puzzle not found.",
    "toolbar.undo": "Undo",
    "toolbar.redo": "Redo",
    "toolbar.reset": "Reset",
    "hint": "Drag to move · Hold Alt and drag to rotate"
  }
}
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

- [ ] **Step 2: Manual verification**

Run:

```bash
cd /workspace/apps/web
npm run dev
```

Manual checks:
- Visit `/en/play` and see list of puzzles
- Click a puzzle -> `/en/play/demo-1`
- Solve puzzle (lock all pieces) -> badge shows + progress saved
- Refresh `/en/play` -> completed + best time/moves visible
- Re-solve slower/worse -> best stats do not regress

