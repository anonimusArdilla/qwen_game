# Production Rename: Puzzle IDs + Titles (Phase 5.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename puzzle IDs and i18n title keys from `demo-*` to production slugs, and migrate existing `localStorage` progress so users keep best time/moves.

**Architecture:** Introduce a stable mapping `oldId -> newId` in the progress module and apply it during `loadProgress()`. Update the catalog to use new slugs and update i18n JSON keys to match. Routes remain `/[locale]/play/[puzzleId]`; old URLs will 404 after rename (expected).

**Tech Stack:** Next.js, TypeScript, next-intl, localStorage.

---

## Mapping (source of truth)

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

---

## Files / Modules

Modify:
- `apps/web/src/lib/puzzles/catalog.ts`
- `apps/web/src/lib/puzzles/progress.ts`
- `apps/web/src/i18n/messages/en.json`
- `apps/web/src/i18n/messages/es.json`
- `apps/web/src/i18n/messages/zh-CN.json`
- `apps/web/src/i18n/messages/ja.json`
- `apps/web/src/i18n/messages/ko.json`

---

### Task 1: Implement progress migration in loadProgress()

**Files:**
- Modify: `apps/web/src/lib/puzzles/progress.ts`

- [ ] **Step 1: Add rename map**

Add near the top of `progress.ts`:

```ts
const puzzleIdRenameMap: Record<string, string> = {
  "demo-1": "starter-six",
  "demo-2": "diagonal-six",
  "demo-3": "cascade-six",
  "demo-4": "cross-six",
  "demo-5": "stack-eight",
  "demo-6": "stagger-eight",
  "demo-7": "split-eight",
  "demo-8": "drift-ten",
  "demo-9": "orbit-ten",
  "demo-10": "dense-twelve-a",
  "demo-11": "dense-twelve-b"
}
```

- [ ] **Step 2: Migrate in loadProgress()**

After parsing, migrate keys:

```ts
const map = parsed as ProgressMap
let changed = false

for (const [oldId, newId] of Object.entries(puzzleIdRenameMap)) {
  const oldVal = map[oldId]
  if (!oldVal) continue
  if (map[newId] == null) {
    map[newId] = oldVal
    changed = true
  }
  delete map[oldId]
  changed = true
}

if (changed) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(map))
}

return map
```

- [ ] **Step 3: Run typecheck**

Run:

```bash
cd /workspace/apps/web
npm run typecheck
```

Expected: PASS.

---

### Task 2: Rename puzzle IDs and titleKey in the catalog

**Files:**
- Modify: `apps/web/src/lib/puzzles/catalog.ts`

- [ ] **Step 1: Update ids + titleKey**

Update each entry:
- `id: "demo-N"` → new slug
- `titleKey: "demoN.title"` → slug key in the same namespace, e.g. `"starter-six.title"`

Example:

```ts
{
  id: "starter-six",
  titleKey: "starter-six.title",
  createInitialState: createDemoPuzzleState
}
```

Keep the same `createInitialState` functions; this is a naming/UX refactor only.

- [ ] **Step 2: Run typecheck**

Run:

```bash
cd /workspace/apps/web
npm run typecheck
```

Expected: PASS.

---

### Task 3: Update i18n keys for puzzle titles (all locales)

**Files:**
- Modify: `apps/web/src/i18n/messages/en.json`
- Modify: `apps/web/src/i18n/messages/es.json`
- Modify: `apps/web/src/i18n/messages/zh-CN.json`
- Modify: `apps/web/src/i18n/messages/ja.json`
- Modify: `apps/web/src/i18n/messages/ko.json`

- [ ] **Step 1: Replace puzzles.demo* keys with puzzles.<slug> keys**

In each locale, replace the `puzzles` object keys:
- remove `demo1`…`demo11`
- add:
  - `starter-six`
  - `diagonal-six`
  - `cascade-six`
  - `cross-six`
  - `stack-eight`
  - `stagger-eight`
  - `split-eight`
  - `drift-ten`
  - `orbit-ten`
  - `dense-twelve-a`
  - `dense-twelve-b`

Use simple localized titles (can be refined later). English example:

```json
"puzzles": {
  "starter-six": { "title": "Starter Six" },
  "diagonal-six": { "title": "Diagonal Six" },
  "cascade-six": { "title": "Cascade Six" },
  "cross-six": { "title": "Cross Six" },
  "stack-eight": { "title": "Stack Eight" },
  "stagger-eight": { "title": "Stagger Eight" },
  "split-eight": { "title": "Split Eight" },
  "drift-ten": { "title": "Drift Ten" },
  "orbit-ten": { "title": "Orbit Ten" },
  "dense-twelve-a": { "title": "Dense Twelve A" },
  "dense-twelve-b": { "title": "Dense Twelve B" }
}
```

- [ ] **Step 2: Run lint + typecheck**

Run:

```bash
cd /workspace/apps/web
npm run lint
npm run typecheck
```

Expected: PASS.

---

### Task 4: Verification (manual + quick http)

- [ ] **Step 1: Ensure dev server running**

Run:

```bash
cd /workspace/apps/web
npm run dev
```

- [ ] **Step 2: Manual**

Manual checks:
- Open `/en/play` and see production titles (no “Demo Puzzle”)
- Click through to `/en/play/starter-six` and verify loads
- Complete once, reload `/en/play`, see progress

- [ ] **Step 3: Migration spot check**

In browser devtools console (or by temporarily setting localStorage), ensure:
- if `woodenPuzzles.progress.v1` contains `"demo-1"`, it migrates to `"starter-six"` after reload
- old keys removed

- [ ] **Step 4: Format**

Run:

```bash
cd /workspace/apps/web
npm run format
```

