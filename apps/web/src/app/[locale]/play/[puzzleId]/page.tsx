import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { PlayView } from "@/components/PlayView"
import { type Locale } from "@/i18n/routing"
import { getPuzzleById } from "@/lib/puzzles/catalog"

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
