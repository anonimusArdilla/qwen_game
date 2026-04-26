"use client"

import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

import {
  applyThemeToDocument,
  isThemePreference,
  themePreferences,
  themeStorageKey,
  type ThemePreference
} from "@/lib/theme"

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system"
  const v = window.localStorage.getItem(themeStorageKey)
  return isThemePreference(v) ? v : "system"
}

function readPreferenceFromDom(): ThemePreference {
  if (typeof document === "undefined") return "system"
  const v = document.documentElement.dataset.theme
  return isThemePreference(v) ? v : "system"
}

export function ThemeSwitcher() {
  const t = useTranslations("settings")
  const [preference, setPreference] = useState<ThemePreference>(() => readPreferenceFromDom())

  const labels = useMemo(
    () => ({
      system: t("theme.system"),
      light: t("theme.light"),
      dark: t("theme.dark")
    }),
    [t]
  )

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    applyThemeToDocument(preference, mql.matches)

    const onChange = (e: MediaQueryListEvent) => {
      const current = readPreference()
      if (current === "system") {
        applyThemeToDocument("system", e.matches)
      }
    }

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [preference])

  return (
    <label className="text-muted inline-flex items-center gap-2 text-sm">
      <span>{t("theme")}</span>
      <select
        className="border-border/15 text-fg rounded-md border bg-transparent px-2 py-1 disabled:opacity-60"
        value={preference}
        onChange={(e) => {
          const next = e.target.value
          if (!isThemePreference(next)) return
          setPreference(next)
          localStorage.setItem(themeStorageKey, next)
          applyThemeToDocument(next, window.matchMedia("(prefers-color-scheme: dark)").matches)
        }}
      >
        {themePreferences.map((p) => (
          <option key={p} value={p}>
            {labels[p]}
          </option>
        ))}
      </select>
    </label>
  )
}
