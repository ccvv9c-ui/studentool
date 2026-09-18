export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  percentage: number;
  isLight: boolean;
  name?: string;
}

export interface WCAGResult {
  ratio: number;
  AA_Normal: boolean;
  AA_Large: boolean;
  AAA_Normal: boolean;
  AAA_Large: boolean;
  scoreLabel: 'Fail' | 'Poor' | 'Good' | 'Excellent';
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: ExtractedColor[];
  createdAt: number;
  tags: string[];
  isFavorite?: boolean;
}

export interface CompressedImageResult {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  format: 'image/webp' | 'image/png' | 'image/jpeg';
  width: number;
  height: number;
  quality: number;
  dataUrl: string;
  createdAt: number;
}

export interface AppSettings {
  openaiApiKey?: string;
  geminiApiKey?: string;
  preferredAiProvider: 'openai' | 'gemini' | 'offline';
  defaultExportFormat: 'tailwind' | 'css' | 'scss';
  compressionQuality: number;
}
