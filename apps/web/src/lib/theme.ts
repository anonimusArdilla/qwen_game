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
  root.classList.toggle("dark", resolveIsDark(preference, systemIsDark))
}
