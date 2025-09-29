import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildCatalogIndex } from "../src/index.js";

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

  it("validates YAML files conform to schema", async () => {
    const result = await buildCatalogIndex({ packRoots: [packsDir] });

    // Check specific entities exist and have correct structure
    const humanEntry = result.index.entities.find((entry) => entry.entity.id === "pf2e.ancestry.human");
    expect(humanEntry).toBeDefined();
    expect(humanEntry?.entity.type).toBe("ancestry");
    expect(humanEntry?.entity.name).toBe("Human");

    const blacksmithEntry = result.index.entities.find((entry) => entry.entity.id === "pf2e.background.blacksmith");
    expect(blacksmithEntry).toBeDefined();
    expect(blacksmithEntry?.entity.type).toBe("background");

    const powerAttackEntry = result.index.entities.find((entry) => entry.entity.id === "pf2e.feat.power-attack");
    expect(powerAttackEntry).toBeDefined();
    expect(powerAttackEntry?.entity.type).toBe("feat");
  });

  it("handles non-existent pack root gracefully", async () => {
    const nonExistentPath = path.resolve(__dirname, "non-existent-packs");
    const result = await buildCatalogIndex({ packRoots: [nonExistentPath] });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].message).toBe("Pack root missing, skipping");
    expect(result.index.entities).toHaveLength(0);
  });

  it("includes pack manifest information", async () => {
    const result = await buildCatalogIndex({ packRoots: [packsDir] });

    expect(result.index.packs.core).toBeDefined();
    expect(result.index.packs.core.id).toBe("core");
    expect(result.index.packs.core.name).toBe("Core Sample Pack");
    expect(result.index.packs.core.license).toBe("ORC");
  });
});
