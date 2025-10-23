import type { CatalogIndex } from "@pen-paper-rpg/schemas";
import { catalogIndexSchema } from "@pen-paper-rpg/schemas";

// In-memory cache for catalog data
let catalogCache: { data: CatalogIndex; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch the catalog index with caching.
 * Loads from pre-built /catalog/catalog.json
 */
export async function fetchCatalogIndex(signal?: AbortSignal): Promise<CatalogIndex> {
  // Check cache first
  if (catalogCache && Date.now() - catalogCache.timestamp < CACHE_DURATION) {
    return catalogCache.data;
  }

  // Load from pre-built JSON
  const response = await fetch('/catalog/catalog.json', { signal });
  if (!response.ok) {
    throw new Error(`Failed to load catalog: ${response.statusText}`);
  }
  const data = await response.json();
  const validated = catalogIndexSchema.parse(data);

  // Update cache
  catalogCache = {
    data: validated,
    timestamp: Date.now(),
  };

  return validated;
}
