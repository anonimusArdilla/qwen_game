import { getTranslations } from "next-intl/server"

import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { Link } from "@/i18n/navigation"
import { type Locale } from "@/i18n/routing"

export async function AppShell({
  children,
  locale
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const tApp = await getTranslations({ locale, namespace: "app" })
  const tNav = await getTranslations({ locale, namespace: "nav" })

  return (
    <>
      <a
        href="#main"
        className="bg-surface text-fg sr-only rounded-md px-3 py-2 shadow-sm focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>
      <header className="border-border/10 bg-surface border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="text-fg text-sm font-medium tracking-wide">{tApp("name")}</div>
            <nav className="flex items-center gap-3">
              <Link href="/play" className="text-muted hover:text-fg text-sm">
                {tNav("play")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl px-6 py-10">
        {children}
      </main>
    </>
  )
}
