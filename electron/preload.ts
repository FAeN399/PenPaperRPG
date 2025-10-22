import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations for saving/loading characters
  saveCharacter: (data: string) => ipcRenderer.invoke('save-character', data),
  loadCharacter: () => ipcRenderer.invoke('load-character'),
  exportCharacter: (data: string, format: string) =>
    ipcRenderer.invoke('export-character', data, format),

  // Listen to messages from main process
  onMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('main-process-message', (_event, message) => callback(message))
  },
})

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: {
      saveCharacter: (data: string) => Promise<void>
      loadCharacter: () => Promise<string>
      exportCharacter: (data: string, format: string) => Promise<void>
      onMessage: (callback: (message: string) => void) => void
    }
  }
}
