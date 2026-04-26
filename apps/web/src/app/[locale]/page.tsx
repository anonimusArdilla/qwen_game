import { getTranslations, setRequestLocale } from "next-intl/server"

import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { type Locale } from "@/i18n/routing"

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const tApp = await getTranslations({ locale, namespace: "app" })
  const tHome = await getTranslations({ locale, namespace: "home" })

  return (
    <main className="min-h-dvh px-6 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        <header className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm tracking-wide text-[rgb(var(--color-muted))]">{tApp("name")}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance">{tHome("title")}</h1>
            <p className="max-w-prose text-base text-pretty text-[rgb(var(--color-muted))]">
              {tHome("subtitle")}
            </p>
          </div>
          <div className="shrink-0">
            <LocaleSwitcher />
          </div>
        </header>
      </div>
    </main>
  )
}
