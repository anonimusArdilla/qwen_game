import { setRequestLocale } from "next-intl/server"

import { PuzzlePicker } from "@/components/PuzzlePicker"
import { type Locale } from "@/i18n/routing"

export default async function PlayPickerPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PuzzlePicker />
}
