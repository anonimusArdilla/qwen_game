export default function HomePage() {
  return (
    <main className="min-h-dvh px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="space-y-2">
          <p className="text-sm tracking-wide text-[rgb(var(--color-muted))]">Wooden Puzzles</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance">
            Calm, tactile puzzle-building — coming soon.
          </h1>
          <p className="max-w-prose text-base text-pretty text-[rgb(var(--color-muted))]">
            Phase 1 scaffolding is complete. Next: localization, theming, and the puzzle engine.
          </p>
        </header>
      </div>
    </main>
  )
}
