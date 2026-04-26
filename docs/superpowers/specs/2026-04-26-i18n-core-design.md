# i18n Core (Phase 2) Design

## Goal
Add production-grade internationalization to the Next.js App Router web app with:
- Route-based locale detection
- Message JSON files per locale
- A locale switcher UI
- Persisted language preference
- CJK-friendly font fallback strategy

Supported locales:
- `en` (English)
- `es` (Spanish)
- `zh-CN` (Simplified Chinese)
- `ja` (Japanese)
- `ko` (Korean)

## Non-Goals (Phase 2)
- Achievements, puzzle engine, levels/themes
- Date/number formatting beyond what next-intl provides by default (we will enable it, but not build complex formatting UIs yet)
- Content-heavy translation coverage (only a small placeholder UI set)

## Recommended Library
Use `next-intl` because it fits App Router and supports:
- Server-side message loading
- Locale-aware routing via middleware
- ICU message formatting, pluralization, and rich text

## Route & Layout Architecture

### URL scheme
- All user-facing pages live under a locale segment:
  - `/en`
  - `/es`
  - `/zh-CN`
  - `/ja`
  - `/ko`

### Redirect behavior
- Requests without locale prefix (e.g. `/`) are redirected to:
  1) persisted locale (cookie `NEXT_LOCALE`) if valid, else
  2) `Accept-Language` best match, else
  3) default locale `en`

### App Router structure
Introduce:
- `src/app/[locale]/layout.tsx` as the locale-aware provider boundary.
- `src/app/[locale]/page.tsx` as the localized landing page.
- `src/app/page.tsx` becomes a small redirect-only page or is removed (middleware handles redirects, but we keep a minimal fallback).

## Translation Files

### Location & format
Store messages in structured JSON:
- `src/i18n/messages/en.json`
- `src/i18n/messages/es.json`
- `src/i18n/messages/zh-CN.json`
- `src/i18n/messages/ja.json`
- `src/i18n/messages/ko.json`

### Initial message keys (minimal)
- `app.name`
- `home.kicker`
- `home.title`
- `home.subtitle`
- `settings.language`

## i18n Modules (Separation of Concerns)

### `src/i18n/routing.ts`
Single source of truth for locales:
- `locales` array
- `defaultLocale`
- `Locale` type
- type guards (e.g. `isLocale(value): value is Locale`)

### `src/i18n/request.ts`
Server-only request config:
- Loads messages via `import()` using the active locale
- Exposes `getRequestConfig` for next-intl integration

## Middleware
Add `src/middleware.ts` to:
- Detect locale from path
- Redirect to localized route when missing
- Set/refresh cookie for persisted locale when possible

Constraints:
- Only run on user-facing routes (exclude `_next`, static assets, API routes).

## Locale Switcher
Add a minimal, accessible locale switcher component:
- `src/components/LocaleSwitcher.tsx`
- Client component that:
  - Shows current locale
  - Navigates to the same pathname under a new locale
  - Persists preference in `NEXT_LOCALE` cookie

Persistence strategy:
- Primary: cookie `NEXT_LOCALE`
- (Optional later) IndexedDB persistence is deferred to a later phase; cookie is sufficient for Phase 2.

## CJK Font Fallback Strategy
Update global font-family stack in `src/styles/globals.css` to prefer:
- system UI fonts for Latin
- platform-native CJK fonts for Chinese/Japanese/Korean
- avoid bundling fonts in Phase 2 (keeps footprint small)

## Verification
- `npm run dev` and confirm each locale route renders:
  - `/en`, `/es`, `/zh-CN`, `/ja`, `/ko`
- Switch locale using UI; confirm:
  - URL updates locale prefix
  - refresh keeps selected locale (cookie)
- `npm run lint`, `npm run typecheck` pass

## Files To Create / Modify (Phase 2)
Create:
- `apps/web/src/middleware.ts`
- `apps/web/src/app/[locale]/layout.tsx`
- `apps/web/src/app/[locale]/page.tsx`
- `apps/web/src/i18n/routing.ts`
- `apps/web/src/i18n/request.ts`
- `apps/web/src/i18n/messages/en.json`
- `apps/web/src/i18n/messages/es.json`
- `apps/web/src/i18n/messages/zh-CN.json`
- `apps/web/src/i18n/messages/ja.json`
- `apps/web/src/i18n/messages/ko.json`
- `apps/web/src/components/LocaleSwitcher.tsx`

Modify:
- `apps/web/src/styles/globals.css`
- `apps/web/src/app/layout.tsx` (minimal root layout; locale-specific layout handles provider)
- `apps/web/package.json` (add `next-intl`)

