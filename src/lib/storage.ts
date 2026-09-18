import { SavedPalette, CompressedImageResult, AppSettings } from './types';

const SETTINGS_KEY = 'assetstudio_settings_v1';
const PALETTES_KEY = 'assetstudio_palettes_v1';
const DB_NAME = 'AssetStudioProDB';
const DB_VERSION = 1;

// IndexedDB Helper for heavier asset binaries
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const Storage = {
  getSettings(): AppSettings {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return {
        preferredAiProvider: 'offline',
        defaultExportFormat: 'tailwind',
        compressionQuality: 0.85,
      };
    }
    try {
      return JSON.parse(stored);
    } catch {
      return {
        preferredAiProvider: 'offline',
        defaultExportFormat: 'tailwind',
        compressionQuality: 0.85,
      };
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getSavedPalettes(): SavedPalette[] {
    const stored = localStorage.getItem(PALETTES_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  savePalette(palette: SavedPalette): SavedPalette[] {
    const existing = this.getSavedPalettes();
    const filtered = existing.filter(p => p.id !== palette.id);
    const updated = [palette, ...filtered];
    localStorage.setItem(PALETTES_KEY, JSON.stringify(updated));
    return updated;
  },

  deletePalette(id: string): SavedPalette[] {
    const existing = this.getSavedPalettes();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(PALETTES_KEY, JSON.stringify(updated));
    return updated;
  },

  async saveHistoryItem(item: CompressedImageResult): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    await store.put(item);
  },

  async getHistoryItems(): Promise<CompressedImageResult[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('history', 'readonly');
      const store = tx.objectStore('history');
      const request = store.getAll();
      request.onsuccess = () => {
        const results = (request.result || []) as CompressedImageResult[];
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async deleteHistoryItem(id: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    await store.delete(id);
  },

  async clearAllHistory(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    await store.clear();
  }
};
