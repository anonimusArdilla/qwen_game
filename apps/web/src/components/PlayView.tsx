"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { PuzzleCanvas } from "@/components/PuzzleCanvas"
import { createDemoPuzzleState } from "@/lib/puzzle/demo"
import { type PuzzleState } from "@/lib/puzzle/state"
import { createUndoState, redoOnce, type UndoState, undoOnce } from "@/lib/puzzle/undo"

export function PlayView() {
  const t = useTranslations("play")
  const [undo, setUndo] = useState<UndoState>(() => createUndoState(100))
  const [state, setState] = useState<PuzzleState>(() => createDemoPuzzleState())

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
          onClick={() => {
            undoOnce(state, undo)
            setState({ ...state, pieces: [...state.pieces] })
          }}
        >
          {t("toolbar.undo")}
        </button>
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
          onClick={() => {
            redoOnce(state, undo)
            setState({ ...state, pieces: [...state.pieces] })
          }}
        >
          {t("toolbar.redo")}
        </button>
        <button
          type="button"
          className="bg-surface-2 text-fg rounded-md px-3 py-2 text-sm shadow-sm"
          onClick={() => {
            setUndo(createUndoState(100))
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
