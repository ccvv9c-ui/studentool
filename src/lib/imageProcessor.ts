import { CompressedImageResult } from './types';

export interface ImageProcessOptions {
  file: File;
  quality: number; // 0.1 - 1.0
  format: 'image/webp' | 'image/png' | 'image/jpeg';
  maxWidth?: number;
  maxHeight?: number;
}

export async function processAndCompressImage(
  options: ImageProcessOptions
): Promise<CompressedImageResult> {
  const { file, quality, format, maxWidth, maxHeight } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      if (maxWidth && targetWidth > maxWidth) {
        targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
        targetWidth = maxWidth;
      }

      if (maxHeight && targetHeight > maxHeight) {
        targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
        targetHeight = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // If converting to JPEG, draw white background first
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image conversion failed'));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const ext = format.split('/')[1];
            const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

            resolve({
              id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              name: `${cleanName}.${ext}`,
              originalSize: file.size,
              compressedSize: blob.size,
              format,
              width: targetWidth,
              height: targetHeight,
              quality: Math.round(quality * 100),
              dataUrl,
              createdAt: Date.now(),
            });
          };
          reader.readAsDataURL(blob);
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image file'));
    };

    img.src = objectUrl;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
