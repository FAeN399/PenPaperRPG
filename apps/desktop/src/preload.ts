import { contextBridge, ipcRenderer } from "electron";

export interface DesktopBridge {
  selectPacksDirectory: () => Promise<{ canceled: boolean; path?: string; catalog?: unknown }>;
  openPacksDirectory: () => Promise<{ path: string }>;
  onCatalogLoaded: (handler: (catalog: unknown) => void) => () => void;
}

const bridge: DesktopBridge = {
  selectPacksDirectory: () => ipcRenderer.invoke("packs:select"),
  openPacksDirectory: () => ipcRenderer.invoke("packs:open"),
  onCatalogLoaded: (handler) => {
    ipcRenderer.on("catalog:loaded", (_event, payload) => handler(payload));
    return () => ipcRenderer.removeAllListeners("catalog:loaded");
  },
};

contextBridge.exposeInMainWorld("penPaperRpg", bridge);

