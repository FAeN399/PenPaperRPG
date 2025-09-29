import type { CatalogLoadError, CatalogLoadWarning } from "@pen-paper-rpg/catalog";
import type { CatalogIndex } from "@pen-paper-rpg/schemas";

declare global {
  interface Window {
    penPaperRpg?: DesktopBridge;
  }
}

export type SelectPacksResult =
  | { canceled: true }
  | {
      canceled: false;
      path: string;
      catalog: CatalogIndex;
      warnings: CatalogLoadWarning[];
      errors: CatalogLoadError[];
    };

export interface DesktopBridge {
  selectPacksDirectory: () => Promise<SelectPacksResult>;
  openPacksDirectory: () => Promise<{ path: string }>;
  onCatalogLoaded: (handler: (catalog: CatalogIndex) => void) => () => void;
}
