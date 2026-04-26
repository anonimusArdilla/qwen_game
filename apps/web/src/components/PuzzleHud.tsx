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
          <span className="bg-surface-2 text-fg rounded-full px-2 py-1 text-xs">
            {t("badgeCompleted")}
          </span>
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
