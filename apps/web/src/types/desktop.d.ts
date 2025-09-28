import type { DesktopBridge, SelectPacksResult } from "../../../apps/desktop/src/preload.js";

declare global {
  interface Window {
    penPaperRpg?: DesktopBridge;
  }
}

export type { DesktopBridge, SelectPacksResult };
