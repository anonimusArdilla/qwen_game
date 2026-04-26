"use client"

import { useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"

import { PuzzleCanvas } from "@/components/PuzzleCanvas"
import { PuzzleHud } from "@/components/PuzzleHud"
import { type PuzzleState } from "@/lib/puzzle/state"
import { createUndoState, redoOnce, type UndoState, undoOnce } from "@/lib/puzzle/undo"
import { getPuzzleById } from "@/lib/puzzles/catalog"
import { loadProgress, mergeResult, saveProgress } from "@/lib/puzzles/progress"

export function PlayView({ puzzleId, puzzleTitle }: { puzzleId: string; puzzleTitle: string }) {
  const t = useTranslations("play")
  const puzzle = useMemo(() => getPuzzleById(puzzleId), [puzzleId])

  const [undo, setUndo] = useState<UndoState>(() => createUndoState(100))
  const [state, setState] = useState<PuzzleState>(() => {
    const p = getPuzzleById(puzzleId)
    if (!p) throw new Error("Missing puzzle")
    return p.createInitialState()
  })

  const startRef = useRef<number>(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  const completed = state.pieces.every((p) => p.locked)
  const moves = undo.past.length

  useEffect(() => {
    startRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (completed) return
    const id = window.setInterval(() => setElapsedMs(Date.now() - startRef.current), 250)
    return () => window.clearInterval(id)
  }, [completed])

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

      <PuzzleCanvas
        state={state}
        undo={undo}
        onStateChange={(next) => {
          const wasCompleted = completed
          setState(next)

          const nowCompleted = next.pieces.every((p) => p.locked)
          if (!wasCompleted && nowCompleted) {
            const timeMs = Date.now() - startRef.current
            const map = loadProgress()
            const merged = mergeResult(map, puzzleId, { timeMs, moves: undo.past.length })
            saveProgress(merged)
            setElapsedMs(timeMs)
          }
        }}
      />
    </div>
  )
}
