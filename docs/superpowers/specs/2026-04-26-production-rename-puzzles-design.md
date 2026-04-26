# Production Rename: Puzzle IDs + Titles (Phase 5.2) Design

## Goal
Remove `demo-*` naming and move to production puzzle IDs and titles, while preserving existing local progress via migration.

## Mapping
Old → New:
- `demo-1` → `starter-six`
- `demo-2` → `diagonal-six`
- `demo-3` → `cascade-six`
- `demo-4` → `cross-six`
- `demo-5` → `stack-eight`
- `demo-6` → `stagger-eight`
- `demo-7` → `split-eight`
- `demo-8` → `drift-ten`
- `demo-9` → `orbit-ten`
- `demo-10` → `dense-twelve-a`
- `demo-11` → `dense-twelve-b`

Titles:
- English can be human-friendly (or “Starter (6)”, etc.), localized per existing locale JSON files.

## Catalog Changes
- Replace puzzle IDs in the catalog with the new slugs.
- Replace `titleKey` strings from `demoN.title` to the new slug key, e.g. `starter-six.title`.
- Ensure the picker and play route use the new IDs.

## i18n Changes
Add `puzzles.<slug>.title` keys for all locales and remove the old `puzzles.demoN.title` keys (optional).

## Progress Migration (localStorage)
Storage key remains: `woodenPuzzles.progress.v1`.

On `loadProgress()`:
- Load existing `ProgressMap`.
- For each old key that exists:
  - If new key does not exist: set `map[new] = map[old]`.
  - Do not overwrite if `map[new]` already exists.
- Remove `map[old]` keys after migration.
- Persist the migrated map back to localStorage.

## Verification
- `/en/play` lists production titles
- Old URLs `/en/play/demo-1` return 404 (expected)
- New URLs `/en/play/starter-six` load correctly
- If localStorage had progress for `demo-*`, it appears under the new puzzle IDs after reload

