import type { CatalogIndex } from "@pen-paper-rpg/schemas";

/**
 * Fetch the catalog from the local API route. The API will source YAML packs and
 * build an index via the catalog package. This helper centralises the request so
 * client and server components can share the same contract.
 */
export async function fetchCatalogIndex(signal?: AbortSignal): Promise<CatalogIndex> {
  const response = await fetch("/api/catalog", { signal, cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load catalog index (${response.status})`);
  }

  return (await response.json()) as CatalogIndex;
}

/**
 * A placeholder loader for server components. Once the API route is implemented,
 * this function can delegate to the same underlying catalog builder used by the
 * desktop app.
 */
export async function loadCatalogIndexServer(): Promise<CatalogIndex> {
  if (process.env.NODE_ENV !== "production") {
    const { buildCatalogIndex } = await import("@pen-paper-rpg/catalog");
    const result = await buildCatalogIndex({ packRoots: ["packs"] });
    return result.index;
  }

  throw new Error("Server-side catalog loading is not yet configured for production.");
}
