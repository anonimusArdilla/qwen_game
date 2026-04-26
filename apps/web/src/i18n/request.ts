import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing, type Locale } from "@/i18n/routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale: Locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const messages = (await import(`./messages/${locale}.json`)).default

  return {
    locale,
    messages
  }
})
