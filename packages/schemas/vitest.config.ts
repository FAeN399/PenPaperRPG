import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    target: "esnext",
    format: "esm",
  },
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
