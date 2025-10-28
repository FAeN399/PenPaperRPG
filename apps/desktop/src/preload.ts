import { contextBridge, ipcRenderer } from "electron";
import type { CatalogIndex } from "@pen-paper-rpg/schemas";
import type { CatalogLoadError, CatalogLoadWarning } from "@pen-paper-rpg/catalog";

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

const bridge: DesktopBridge = {
  selectPacksDirectory: () => ipcRenderer.invoke("packs:select"),
  openPacksDirectory: () => ipcRenderer.invoke("packs:open"),
  onCatalogLoaded: (handler) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: CatalogIndex) => handler(payload);
    ipcRenderer.on("catalog:loaded", listener);
    return () => ipcRenderer.removeListener("catalog:loaded", listener);
  },
};

contextBridge.exposeInMainWorld("penPaperRpg", bridge);

