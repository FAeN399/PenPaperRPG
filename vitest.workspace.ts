import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/schemas/vitest.config.ts",
  "packages/catalog/vitest.config.ts",
  "packages/engine/vitest.config.ts",
]);
