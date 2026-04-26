import { setRequestLocale } from "next-intl/server"

import { PlayView } from "@/components/PlayView"
import { type Locale } from "@/i18n/routing"

export default async function PlayPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PlayView />
}
