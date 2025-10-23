/**
 * Browser-only entry point for catalog package
 * This file contains no Node.js dependencies and can be safely bundled for the browser
 */

import { catalogIndexSchema, type CatalogIndex } from "@pen-paper-rpg/schemas";

/**
 * Load catalog from pre-built JSON (browser-compatible)
 * This function can be used in browser environments where fs is not available
 */
export async function loadCatalogFromJSON(jsonPath: string): Promise<CatalogIndex> {
  const response = await fetch(jsonPath);
  if (!response.ok) {
    throw new Error(`Failed to load catalog: ${response.statusText}`);
  }
  const data = await response.json();
  return catalogIndexSchema.parse(data);
}

/**
 * Get catalog in browser environment
 * Loads from pre-built JSON at /catalog/catalog.json by default
 */
export async function getCatalog(options?: {
  /** Custom JSON path (default: /catalog/catalog.json) */
  jsonPath?: string;
}): Promise<CatalogIndex> {
  const jsonPath = options?.jsonPath ?? '/catalog/catalog.json';
  return loadCatalogFromJSON(jsonPath);
}
