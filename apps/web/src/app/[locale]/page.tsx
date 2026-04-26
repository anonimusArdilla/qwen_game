import { getTranslations, setRequestLocale } from "next-intl/server"

import { type Locale } from "@/i18n/routing"

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const tHome = await getTranslations({ locale, namespace: "home" })

  return (
    <section className="space-y-2">
      <h1 className="text-fg text-4xl font-semibold tracking-tight text-balance">
        {tHome("title")}
      </h1>
      <p className="text-muted max-w-prose text-base text-pretty">{tHome("subtitle")}</p>
    </section>
  )
}
