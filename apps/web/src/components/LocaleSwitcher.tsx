"use client"

import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
}

export function LocaleSwitcher() {
  const t = useTranslations("settings")
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  return (
    <label className="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]">
      <span>{t("language")}</span>
      <select
        className="rounded-md border border-black/10 bg-transparent px-2 py-1 text-[rgb(var(--color-fg))] disabled:opacity-60 dark:border-white/15"
        value={locale}
        disabled={isPending}
        onChange={(e) => {
          const nextLocale = e.target.value as Locale
          setLocaleCookie(nextLocale)
          startTransition(() => {
            router.replace(pathname, { locale: nextLocale })
          })
        }}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
