# Design System & Layout (Phase 3) Design

## Goal
Establish a minimalist, elegant UI foundation with:
- Design tokens (CSS variables) for color, typography, radii, shadows, and motion
- A consistent responsive layout shell (header + content)
- Theme preference support: `system` / `light` / `dark`
- Accessibility baseline (WCAG 2.2 AA-minded defaults)

This phase deliberately avoids puzzle/game mechanics.

## Constraints & Principles
- Tokens are the source of truth (no scattered magic colors).
- UI is calm and unobtrusive (subtle contrast, restrained accents).
- No heavy textures or external images in this phase.
- Keep boundaries clean: tokens/styles are pure; UI components consume tokens; no game state.

## Theme Model
### Preference values
- `system` (default)
- `light`
- `dark`

### Application mechanism
- Apply theme by toggling:
  - `document.documentElement.dataset.theme = <preference>`
  - `document.documentElement.classList.toggle('dark', resolvedIsDark)`
- `resolvedIsDark` is computed from:
  - if preference is `dark` → dark
  - if preference is `light` → light
  - if preference is `system` → `matchMedia('(prefers-color-scheme: dark)')`

### Persistence
- Persist preference in `localStorage` under key: `theme`
- Do not persist the resolved theme; resolve at runtime.

### No-flash requirement
- Inject a tiny early script in the document to apply the persisted preference before paint.

## Design Tokens
Create a dedicated tokens file and keep global CSS minimal:
- `src/styles/tokens.css`
  - Light tokens in `:root`
  - Dark tokens in `.dark`

### Token categories
- **Color** (semantic, not raw):
  - `--color-bg`, `--color-fg`, `--color-muted`, `--color-border`, `--color-accent`
  - Optional: `--color-surface`, `--color-surface-2`
- **Radii**:
  - `--radius-sm`, `--radius-md`, `--radius-lg`
- **Shadows**:
  - `--shadow-sm`, `--shadow-md`
- **Motion**:
  - `--ease-standard`
  - `--dur-1`, `--dur-2`

## Tailwind Integration
Map semantic Tailwind colors to tokens so components can use:
- `bg-[rgb(var(--color-bg))]` directly today (already used)
- and/or `theme.extend.colors` entries like `bg`, `fg`, `muted`, `accent` for nicer class ergonomics.

Tailwind remains utility-first, but tokens control the values.

## Layout Shell
### AppShell responsibilities
- Provide a consistent page frame:
  - Skip link
  - Minimal header with:
    - App name
    - Locale switcher
    - Theme switcher
  - Main content container

### Component structure
- `src/components/AppShell.tsx` (server component)
  - Accepts `children`
  - Renders header + main
- `src/components/ThemeSwitcher.tsx` (client component)
  - Dropdown with `system/light/dark`
  - Uses `localStorage` + updates `<html>` attributes/classes

## Accessibility Baseline
- Add focus-visible styles (highly visible, minimal).
- Respect reduced-motion:
  - Disable or shorten transitions with `@media (prefers-reduced-motion: reduce)`.
- Ensure interactive controls have labels:
  - Theme switcher uses visible label or `aria-label`.
  - Locale switcher already has text label.

## i18n Integration
Add translation keys for theme UI:
- `settings.theme`
- `settings.theme.system`
- `settings.theme.light`
- `settings.theme.dark`

## Files To Create / Modify (Phase 3)
Create:
- `apps/web/src/styles/tokens.css`
- `apps/web/src/components/AppShell.tsx`
- `apps/web/src/components/ThemeScript.tsx` (server component that injects early script)
- `apps/web/src/components/ThemeSwitcher.tsx`
- `apps/web/src/lib/theme.ts` (pure helpers + constants)

Modify:
- `apps/web/src/styles/globals.css` (import tokens, add a11y utilities)
- `apps/web/tailwind.config.ts` (optional: semantic colors mapping)
- `apps/web/src/app/[locale]/layout.tsx` (wrap children with AppShell; include ThemeScript)
- `apps/web/src/components/LocaleSwitcher.tsx` (add token-based styling if needed)
- `apps/web/src/i18n/messages/*.json` (add theme labels)

## Verification
- Theme switching:
  - Selecting `dark` sets `<html class="dark">`
  - Selecting `light` removes `dark`
  - Selecting `system` follows OS setting (and responds to changes)
- No-flash:
  - Reload page with dark preference: background renders dark immediately
- i18n:
  - Theme labels translate on `/en`, `/es`, `/zh-CN`, `/ja`, `/ko`
- Tooling:
  - `npm run format:check`, `npm run lint`, `npm run typecheck` pass

