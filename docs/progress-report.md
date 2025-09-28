# Project Progress Report

## Current State
- Monorepo scaffolded with pnpm + Turborepo, shared base TypeScript, ESLint, and Prettier configs.
- Workspace structure in place: `apps/web`, `apps/desktop`, and core packages (`schemas`, `catalog`, `engine`, `pdf`, `shared`).
- Sample PF2e Remaster content provided in `packs/core` for Human ancestry, Blacksmith background, Fighter class, and Power Attack feat.

## Key Work Completed
- **Schemas (`packages/schemas`)**: Comprehensive Zod models for content entities, rule predicates/effects, character files, and catalog data. Builds successfully to `dist/`.
- **Catalog Loader (`packages/catalog`)**: YAML ingest + validation + catalog indexing with hashing and duplicate detection.
- **Rules Engine (`packages/engine`)**: Base rule helpers for ability adjustments, derived stat calculations, predicate evaluation, and proficiency math.
- **Web App (`apps/web`)**: Next.js App Router skeleton with global styling and introductory copy.
- **Desktop Shell (`apps/desktop`)**: Electron main/preload scripts ready to host the web app, manage pack directories, and emit catalog payloads.
- **PDF Package (`packages/pdf`)**: React-PDF scaffold for future character sheet exports.
- **Testing Harness**:
  - Vitest configs for schemas, catalog, and engine packages.
  - Sample tests validating schemas, catalog indexing, and derived stat math.
  - Turbo pipeline orchestrates `build/test/typecheck` tasks.

## Testing & Build Status (as of now)
- `pnpm --dir packages/schemas run build` ✅
- `pnpm --dir packages/engine run build` ✅
- `pnpm --dir packages/catalog run build` ✅
- `pnpm test` currently fails in `packages/catalog` because the test expects no warnings and non-empty entities. Adjusting fixtures/expectations is pending.

## Outstanding Work
1. **Schema Distribution Strategy**: Finalise Option #1 (build schemas first, consumers import compiled output) by introducing a post-build copy or script to place `dist/` artifacts where Node can resolve them without symlinks.
2. **Catalog Test Fix**: Update `catalog-build.test.ts` expectations now that the pack root path needs to be relative to the package; ensure the test points at the sample pack and handles warnings appropriately.
3. **Engine Features**: Implement effect application, choice resolution, stacking rules, and history/persistence beyond the existing math helpers.
4. **UI Flows**: Build creation/leveling flows in `apps/web`, and wire the Electron preload bridge to a renderer.
5. **PDF Output**: Flesh out the sheet layout and data binding in `packages/pdf`.
6. **Automation**: Configure CI, lint/typecheck commands per package, and decide on artifact publishing strategy.

## Environment Considerations
- Workspace lives on an exFAT drive. pnpm symlinks are disabled (`package-import-method=copy`, `link-workspace-packages=false`); keep this in mind when introducing workspace dependencies.
- Node 22.16.0, pnpm 10.10.0.

## Next Steps
1. Finalise the schema build/link workflow (post-build copy or an internal `publish` step) and update engine/catalog imports accordingly.
2. Fix the catalog test to point at the correct sample data path and update assertions.
3. Expand engine tests to cover multiple predicate/effect scenarios, ensuring deterministic results.
4. Begin implementing the character creation wizard in `apps/web` using the schema-validated data.
5. Outline the Electron renderer and IPC contract for catalogue refresh and local save management.
