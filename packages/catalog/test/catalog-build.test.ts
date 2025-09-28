import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildCatalogIndex } from "../dist/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packsDir = path.resolve(__dirname, "..", "..", "..", "packs");

describe("catalog builder", () => {
  it("loads the sample pack without validation errors", async () => {
    const result = await buildCatalogIndex({ packRoots: [packsDir] });

    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toEqual([]);
    expect(result.index.entities.length).toBeGreaterThan(0);
    const fighterEntry = result.index.entities.find((entry) => entry.entity.id === "pf2e.class.fighter");
    expect(fighterEntry).toBeDefined();
  });
});
