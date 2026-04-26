# Design System & Layout (Phase 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement design tokens, theme preference (system/light/dark) with no-flash behavior, and an accessible app shell layout (header + main) for the localized App Router.

**Architecture:** Keep theme logic pure in `src/lib/theme.ts`, apply the chosen theme via a tiny early script (`ThemeScript`) plus a client `ThemeSwitcher`. Centralize visual constants in `src/styles/tokens.css` and map Tailwind semantic utilities to tokens.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, next-intl.

---

## Files / Modules

Create:
- `apps/web/src/styles/tokens.css`
- `apps/web/src/lib/theme.ts`
- `apps/web/src/components/ThemeScript.tsx`
- `apps/web/src/components/ThemeSwitcher.tsx`
- `apps/web/src/components/AppShell.tsx`

Modify:
- `apps/web/src/styles/globals.css`
- `apps/web/tailwind.config.ts`
- `apps/web/src/app/[locale]/layout.tsx`
- `apps/web/src/app/[locale]/page.tsx`
- `apps/web/src/i18n/messages/en.json`
- `apps/web/src/i18n/messages/es.json`
- `apps/web/src/i18n/messages/zh-CN.json`
- `apps/web/src/i18n/messages/ja.json`
- `apps/web/src/i18n/messages/ko.json`

---

### Task 1: Add design tokens

**Files:**
- Create: `apps/web/src/styles/tokens.css`
- Modify: `apps/web/src/styles/globals.css`

- [ ] **Step 1: Create tokens.css**

Create `apps/web/src/styles/tokens.css`:

```css
:root {
  --color-bg: 255 255 255;
  --color-fg: 17 17 17;
  --color-muted: 102 102 102;
  --color-border: 0 0 0;
  --color-accent: 166 124 82;
  --color-surface: 255 255 255;
  --color-surface-2: 247 247 247;

  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.08);

  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-1: 200ms;
  --dur-2: 300ms;
}

.dark {
  --color-bg: 12 12 12;
  --color-fg: 245 245 245;
  --color-muted: 170 170 170;
  --color-border: 255 255 255;
  --color-accent: 196 150 104;
  --color-surface: 18 18 18;
  --color-surface-2: 26 26 26;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 2: Update globals.css to import tokens and add a11y/motion defaults**

Replace `apps/web/src/styles/globals.css` with:

```css
@import "tailwindcss";
@import "@/styles/tokens.css";

html,
body {
  height: 100%;
}

body {
  background: rgb(var(--color-bg));
  color: rgb(var(--color-fg));
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
    "PingFang SC",
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "Microsoft YaHei",
    "Noto Sans CJK SC",
    "Noto Sans CJK JP",
    "Apple SD Gothic Neo",
    "Noto Sans CJK KR",
    sans-serif;
}

:focus-visible {
  outline: 2px solid rgb(var(--color-accent));
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

### Task 2: Map Tailwind semantic utilities to tokens

**Files:**
- Modify: `apps/web/tailwind.config.ts`

- [ ] **Step 1: Update tailwind config**

Replace `apps/web/tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)"
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)"
      },
      transitionDuration: {
        200: "var(--dur-1)",
        300: "var(--dur-2)"
      }
    }
  },
  plugins: []
} satisfies Config
```

---

### Task 3: Theme core (pure helpers + no-flash script)

**Files:**
- Create: `apps/web/src/lib/theme.ts`
- Create: `apps/web/src/components/ThemeScript.tsx`

- [ ] **Step 1: Create theme helpers**

Create `apps/web/src/lib/theme.ts`:

```ts
export const themeStorageKey = "theme"

export type ThemePreference = "system" | "light" | "dark"

export const themePreferences: readonly ThemePreference[] = ["system", "light", "dark"]

export function isThemePreference(value: unknown): value is ThemePreference {
  return themePreferences.includes(value as ThemePreference)
}

export function resolveIsDark(preference: ThemePreference, systemIsDark: boolean): boolean {
  if (preference === "dark") return true
  if (preference === "light") return false
  return systemIsDark
}

export function applyThemeToDocument(preference: ThemePreference, systemIsDark: boolean) {
  const root = document.documentElement
  root.dataset.theme = preference
  const isDark = resolveIsDark(preference, systemIsDark)
  root.classList.toggle("dark", isDark)
}
```

- [ ] **Step 2: Create ThemeScript**

Create `apps/web/src/components/ThemeScript.tsx`:

```tsx
import { themeStorageKey } from "@/lib/theme"

export function ThemeScript() {
  const code = `(function(){try{var k=${JSON.stringify(
    themeStorageKey
  )};var p=localStorage.getItem(k)||"system";var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)");var s=!!(m&&m.matches);var d=p==="dark"||(p!=="light"&&s);var r=document.documentElement;r.dataset.theme=p;r.classList.toggle("dark",d);}catch(e){}})();`

  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
```

---

### Task 4: Theme switcher + App shell

**Files:**
- Create: `apps/web/src/components/ThemeSwitcher.tsx`
- Create: `apps/web/src/components/AppShell.tsx`
- Modify: `apps/web/src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add theme switcher**

Create `apps/web/src/components/ThemeSwitcher.tsx`:

```tsx
"use client"

import { useLocale, useTranslations } from "next-intl"
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

export function ThemeSwitcher() {
  useLocale()
  const t = useTranslations("settings")
  const [preference, setPreference] = useState<ThemePreference>("system")

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
    const nextPref = readPreference()
    setPreference(nextPref)
    applyThemeToDocument(nextPref, mql.matches)

    const onChange = (e: MediaQueryListEvent) => {
      const current = readPreference()
      if (current === "system") {
        applyThemeToDocument("system", e.matches)
      }
    }

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span>{t("theme")}</span>
      <select
        className="rounded-md border border-border/15 bg-transparent px-2 py-1 text-fg"
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
```

- [ ] **Step 2: Add AppShell**

Create `apps/web/src/components/AppShell.tsx`:

```tsx
import { getTranslations } from "next-intl/server"

import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { type Locale } from "@/i18n/routing"

export async function AppShell({
  children,
  locale
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const tApp = await getTranslations({ locale, namespace: "app" })

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-surface px-3 py-2 text-fg shadow-sm"
      >
        Skip to content
      </a>
      <header className="border-b border-border/10 bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="text-sm font-medium tracking-wide text-fg">{tApp("name")}</div>
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
```

- [ ] **Step 3: Update locale layout to include ThemeScript + AppShell**

Replace `apps/web/src/app/[locale]/layout.tsx` with:

```tsx
import { hasLocale } from "next-intl"
import { NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/AppShell"
import { ThemeScript } from "@/components/ThemeScript"
import { routing, type Locale } from "@/i18n/routing"
import "@/styles/globals.css"

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
```

---

### Task 5: Update localized landing page to use semantic token classes

**Files:**
- Modify: `apps/web/src/app/[locale]/page.tsx`

- [ ] **Step 1: Update page**

Replace `apps/web/src/app/[locale]/page.tsx` with:

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server"

import { type Locale } from "@/i18n/routing"

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const tHome = await getTranslations({ locale, namespace: "home" })

  return (
    <section className="space-y-2">
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-fg">
        {tHome("title")}
      </h1>
      <p className="max-w-prose text-pretty text-base text-muted">{tHome("subtitle")}</p>
    </section>
  )
}
```

---

### Task 6: Add theme translations

**Files:**
- Modify: `apps/web/src/i18n/messages/en.json`
- Modify: `apps/web/src/i18n/messages/es.json`
- Modify: `apps/web/src/i18n/messages/zh-CN.json`
- Modify: `apps/web/src/i18n/messages/ja.json`
- Modify: `apps/web/src/i18n/messages/ko.json`

- [ ] **Step 1: Update en.json**

```json
{
  "app": { "name": "Wooden Puzzles" },
  "home": {
    "kicker": "Wooden Puzzles",
    "title": "Calm, tactile puzzle-building — coming soon.",
    "subtitle": "Phase 2 localization is wired. Next: theming and the puzzle engine."
  },
  "settings": {
    "language": "Language",
    "theme": "Theme",
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark"
  }
}
```

- [ ] **Step 2: Update es.json**

```json
{
  "app": { "name": "Rompecabezas de Madera" },
  "home": {
    "kicker": "Rompecabezas de Madera",
    "title": "Un rompecabezas táctil y relajante — muy pronto.",
    "subtitle": "La localización de la Fase 2 ya está lista. Próximo: temas y motor del puzzle."
  },
  "settings": {
    "language": "Idioma",
    "theme": "Tema",
    "theme.system": "Sistema",
    "theme.light": "Claro",
    "theme.dark": "Oscuro"
  }
}
```

- [ ] **Step 3: Update zh-CN.json**

```json
{
  "app": { "name": "木质拼图" },
  "home": {
    "kicker": "木质拼图",
    "title": "沉静、触感十足的拼图体验 —— 即将上线。",
    "subtitle": "第 2 阶段本地化已接入。下一步：主题与拼图引擎。"
  },
  "settings": {
    "language": "语言",
    "theme": "主题",
    "theme.system": "跟随系统",
    "theme.light": "浅色",
    "theme.dark": "深色"
  }
}
```

- [ ] **Step 4: Update ja.json**

```json
{
  "app": { "name": "木製パズル" },
  "home": {
    "kicker": "木製パズル",
    "title": "落ち着いた、触感のあるパズル体験 — 近日公開。",
    "subtitle": "フェーズ2のローカライズが完了しました。次はテーマとパズルエンジンです。"
  },
  "settings": {
    "language": "言語",
    "theme": "テーマ",
    "theme.system": "システム",
    "theme.light": "ライト",
    "theme.dark": "ダーク"
  }
}
```

- [ ] **Step 5: Update ko.json**

```json
{
  "app": { "name": "우드 퍼즐" },
  "home": {
    "kicker": "우드 퍼즐",
    "title": "차분하고 촉감적인 퍼즐 경험 — 곧 공개됩니다.",
    "subtitle": "2단계 로컬라이제이션 연결이 완료되었습니다. 다음: 테마와 퍼즐 엔진."
  },
  "settings": {
    "language": "언어",
    "theme": "테마",
    "theme.system": "시스템",
    "theme.light": "라이트",
    "theme.dark": "다크"
  }
}
```

---

### Task 7: Verification

- [ ] **Step 1: Format + lint + typecheck**

Run:

```bash
cd /workspace/apps/web
npm run format:check
npm run lint
npm run typecheck
```

- [ ] **Step 2: Dev server + manual checks**

Run:

```bash
cd /workspace/apps/web
npm run dev
```

Manual checks:
- Theme dropdown changes `document.documentElement.dataset.theme` to `system|light|dark`
- `dark` preference adds `<html class="dark">`
- Reload page: dark background appears immediately when theme is `dark`
- Locale switcher + theme switcher both visible and translated

