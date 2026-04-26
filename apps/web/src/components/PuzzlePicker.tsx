"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import { Link } from "@/i18n/navigation"
import { puzzles } from "@/lib/puzzles/catalog"
import { formatDurationMs } from "@/lib/puzzles/format"
import { loadProgress, type ProgressMap } from "@/lib/puzzles/progress"

export function PuzzlePicker() {
  const tPlay = useTranslations("play")
  const tPuzzles = useTranslations("puzzles")
  const [progress] = useState<ProgressMap>(() => loadProgress())

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
                  <span className="text-fg">
                    {progress.bestMoves != null ? progress.bestMoves : "—"}
                  </span>
                </div>
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  )
}
