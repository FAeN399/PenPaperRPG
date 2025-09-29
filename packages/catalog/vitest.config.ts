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
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["test/**/*"],
      reporter: ["text", "html", "clover"],
    },
  },
});
