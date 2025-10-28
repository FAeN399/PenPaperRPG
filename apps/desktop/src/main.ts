import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import fs from "fs-extra";
import path from "node:path";
import Store from "electron-store";
import { buildCatalogIndex } from "@pen-paper-rpg/catalog";
import type { CatalogBuildResult } from "@pen-paper-rpg/catalog";

const store = new Store<{ packsDir: string | null }>({
  name: "pen-paper-rpg",
  defaults: {
    packsDir: null,
  },
});

const isDev = !app.isPackaged;
const rendererUrl = isDev
  ? "http://localhost:3000"
  : `file://${path.join(app.getAppPath(), "..", "web", "index.html")}`;

const preloadPath = isDev
  ? path.join(process.cwd(), "apps", "desktop", "dist", "preload.js")
  : path.join(app.getAppPath(), "dist", "preload.js");

async function ensurePacksDirectory(): Promise<string> {
  const configuredPath = store.get("packsDir");
  if (configuredPath && (await fs.pathExists(configuredPath))) {
    return configuredPath;
  }

  const defaultPath = path.join(app.getPath("documents"), "PenPaperRPG", "packs");
  await fs.ensureDir(defaultPath);
  store.set("packsDir", defaultPath);
  return defaultPath;
}

async function loadCatalog(packsDir: string): Promise<CatalogBuildResult> {
  return buildCatalogIndex({ packRoots: [packsDir] });
}

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    title: "PenPaperRPG",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  if (isDev) {
    await mainWindow.loadURL(rendererUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await mainWindow.loadURL(rendererUrl);
  }

  mainWindow.on("closed", () => {
    app.quit();
  });

  const packsDir = await ensurePacksDirectory();
  const catalogResult = await loadCatalog(packsDir);
  mainWindow.webContents.send("catalog:loaded", catalogResult.index);
}

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("packs:select", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select Packs Directory",
    properties: ["openDirectory"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const selectedPath = result.filePaths[0];
  store.set("packsDir", selectedPath);
  const catalogResult = await loadCatalog(selectedPath);
  return {
    canceled: false,
    path: selectedPath,
    catalog: catalogResult.index,
    warnings: catalogResult.warnings,
    errors: catalogResult.errors,
  };
});

ipcMain.handle("packs:open", async () => {
  const packsDir = await ensurePacksDirectory();
  await shell.openPath(packsDir);
  return { path: packsDir };
});



