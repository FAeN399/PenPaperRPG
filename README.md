# PenPaperRPG

Local-first Pathfinder Second Edition Remaster character creator and leveler.

## Packages

- `packages/schemas` – Zod schemas for content entities and character files.
- `packages/catalog` – YAML loader and catalog indexer for SRD/homebrew packs.
- `packages/engine` – Rule helpers for ability adjustments, proficiencies, and derived stats.
- `packages/pdf` – React PDF renderer for printable character sheets.
- `packages/shared` – Small shared utilities.

## Apps

- `apps/web` – Next.js (App Router) frontend, PWA ready.
- `apps/desktop` – Electron shell loading the web UI and managing pack directories.

## Sample Data

`packs/core` contains a minimal PF2e Remaster sample pack (Human ancestry, Blacksmith background, Fighter class, Power Attack feat) used by tests and early prototyping. Drop full SRD YAML packs in this directory to expand coverage.

## Scripts

- `pnpm dev --filter web` – Run the web app in development.
- `pnpm dev --filter desktop` – Launch the Electron shell (expects the web dev server on port 3000).
- `pnpm lint` / `pnpm test` / `pnpm typecheck` – Turborepo orchestrated checks across the workspace.

## Roadmap Snapshot

1. Flesh out the rules engine (choices, effect application, predicate coverage).
2. Build the creation and leveling wizards in the web app.
3. Expand YAML pack coverage to all Remaster SRD entities.
4. Generate full character PDF exports and add delta history views.

