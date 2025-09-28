import type { DesktopBridge } from "../../../apps/desktop/src/preload.js";

declare global {
  interface Window {
    penPaperRpg?: DesktopBridge;
  }
}

export {};
