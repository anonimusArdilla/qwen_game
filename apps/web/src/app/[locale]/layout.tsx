import { hasLocale } from "next-intl"
import { NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/AppShell"
import { ThemeScript } from "@/components/ThemeScript"
import "@/styles/globals.css"
import { routing, type Locale } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default

  return (
    <html lang={locale}>
      <head>
        <ThemeScript />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppShell locale={locale as Locale}>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
