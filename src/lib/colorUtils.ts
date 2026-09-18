import { ExtractedColor, WCAGResult } from './types';

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Extract dominant colors from an Image using Canvas pixel data sampling & k-means clustering
export function extractColorsFromCanvas(canvas: HTMLCanvasElement, colorCount = 6): ExtractedColor[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // Downsample image for performance
  const sampleWidth = 120;
  const sampleHeight = Math.max(1, Math.round((canvas.height / canvas.width) * sampleWidth));
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sampleWidth;
  tempCanvas.height = sampleHeight;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return [];

  tempCtx.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
  const imgData = tempCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imgData.data;

  // Simple Color Quantization with grid bucket grouping
  const bucketSize = 32;
  const colorBuckets: Map<string, { r: number; g: number; b: number; count: number }> = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue; // Skip semi-transparent pixels

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key = `${Math.floor(r / bucketSize)},${Math.floor(g / bucketSize)},${Math.floor(b / bucketSize)}`;

    const existing = colorBuckets.get(key);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count += 1;
    } else {
      colorBuckets.set(key, { r, g, b, count: 1 });
    }
  }

  const sortedBuckets = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
  const totalSampleCount = sortedBuckets.reduce((sum, item) => sum + item.count, 0) || 1;

  // Select top distinct colors
  const selected: { r: number; g: number; b: number; count: number }[] = [];
  const minDistance = 45; // Euclidean distance threshold in RGB space

  for (const bucket of sortedBuckets) {
    const avgR = Math.round(bucket.r / bucket.count);
    const avgG = Math.round(bucket.g / bucket.count);
    const avgB = Math.round(bucket.b / bucket.count);

    const isTooSimilar = selected.some(s => {
      const dist = Math.sqrt(
        Math.pow(s.r - avgR, 2) + Math.pow(s.g - avgG, 2) + Math.pow(s.b - avgB, 2)
      );
      return dist < minDistance;
    });

    if (!isTooSimilar) {
      selected.push({ r: avgR, g: avgG, b: avgB, count: bucket.count });
      if (selected.length >= colorCount) break;
    }
  }

  return selected.map((c, index) => {
    const hex = rgbToHex(c.r, c.g, c.b);
    const hsl = rgbToHsl(c.r, c.g, c.b);
    const percentage = Math.round((c.count / totalSampleCount) * 100);
    const isLight = hsl.l > 60;
    const colorNames = ['Primary', 'Secondary', 'Accent', 'Muted', 'Highlight', 'Background'];

    return {
      hex,
      rgb: { r: c.r, g: c.g, b: c.b },
      hsl,
      percentage: Math.max(percentage, 5),
      isLight,
      name: colorNames[index] || `Color ${index + 1}`,
    };
  });
}

// Calculate Relative Luminance (WCAG 2.1)
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// WCAG Contrast Checker Ratio
export function calculateContrast(hex1: string, hex2: string): WCAGResult {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const roundRatio = Math.round(ratio * 100) / 100;

  const AA_Normal = ratio >= 4.5;
  const AA_Large = ratio >= 3.0;
  const AAA_Normal = ratio >= 7.0;
  const AAA_Large = ratio >= 4.5;

  let scoreLabel: WCAGResult['scoreLabel'] = 'Fail';
  if (ratio >= 7) scoreLabel = 'Excellent';
  else if (ratio >= 4.5) scoreLabel = 'Good';
  else if (ratio >= 3) scoreLabel = 'Poor';

  return {
    ratio: roundRatio,
    AA_Normal,
    AA_Large,
    AAA_Normal,
    AAA_Large,
    scoreLabel,
  };
}

// Generate CSS Variables block from colors
export function generateCssVariables(colors: ExtractedColor[]): string {
  let css = `:root {\n`;
  colors.forEach((c, i) => {
    const varName = c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : `color-${i + 1}`;
    css += `  --color-${varName}: ${c.hex};\n`;
    css += `  --color-${varName}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};\n`;
    css += `  --color-${varName}-hsl: ${c.hsl.h}deg ${c.hsl.s}% ${c.hsl.l}%;\n`;
  });
  css += `}`;
  return css;
}

// Generate Tailwind Config Snippet
export function generateTailwindConfig(colors: ExtractedColor[]): string {
  const colorObj: Record<string, string> = {};
  colors.forEach((c, i) => {
    const key = c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : `brand-${i + 1}`;
    colorObj[key] = c.hex;
  });

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colorObj, null, 8)}
    }
  }
}`;
}
