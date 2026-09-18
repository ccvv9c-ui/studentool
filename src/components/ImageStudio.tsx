import React, { useState, useRef, useEffect } from 'react';
import { 
  FileImage, 
  Upload, 
  Download, 
  Sliders, 
  Sparkles, 
  Trash2, 
  ArrowRight,
  History
} from 'lucide-react';
import { CompressedImageResult } from '../lib/types';
import { processAndCompressImage, formatFileSize } from '../lib/imageProcessor';
import { Storage } from '../lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Badge } from './ui/badge';

export const ImageStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewOriginalUrl, setPreviewOriginalUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.82);
  const [format, setFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [maxWidth, setMaxWidth] = useState<string>('');
  
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CompressedImageResult | null>(null);
  const [history, setHistory] = useState<CompressedImageResult[]>([]);
  const [splitPos, setSplitPos] = useState<number>(50);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const items = await Storage.getHistoryItems();
      setHistory(items);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewOriginalUrl(url);
    setResult(null);
  };

  // Trigger Compression Process
  const handleCompress = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    try {
      const processed = await processAndCompressImage({
        file: selectedFile,
        quality,
        format,
        maxWidth: maxWidth ? parseInt(maxWidth, 10) : undefined,
      });
      setResult(processed);
      await Storage.saveHistoryItem(processed);
      loadHistory();
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleCompress();
    }
  }, [quality, format, maxWidth]);

  const handleDownload = (item: CompressedImageResult) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteHistoryItem = async (id: string) => {
    await Storage.deleteHistoryItem(id);
    loadHistory();
  };

  const calculateSavings = () => {
    if (!result) return 0;
    const diff = result.originalSize - result.compressedSize;
    return Math.round((diff / result.originalSize) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compression Control Panel */}
        <Card className="lg:col-span-5 bg-card/60 backdrop-blur-md border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileImage className="h-5 w-5 text-indigo-400" />
              <span>Image Optimizer & Converter</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Convert PNG/JPG to WebP and compress completely client-side in browser memory
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Upload Drag zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
              }}
              className="group border-2 border-dashed border-border/80 hover:border-indigo-500/60 bg-slate-950/40 p-6 rounded-xl text-center cursor-pointer transition-all"
            >
              <Upload className="h-8 w-8 mx-auto text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-foreground">
                {selectedFile ? selectedFile.name : 'Select or Drop an Image File'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {selectedFile ? `${formatFileSize(selectedFile.size)}` : 'Supports PNG, JPEG, WebP, AVIF'}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Slider Controls */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                    Compression Quality
                  </span>
                  <span className="font-mono text-indigo-400 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <Slider
                  value={[quality]}
                  min={0.1}
                  max={1.0}
                  step={0.01}
                  onValueChange={(vals) => setQuality(vals[0])}
                  className="py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Output Format
                  </label>
                  <Select
                    value={format}
                    onValueChange={(val: 'image/webp' | 'image/png' | 'image/jpeg') => setFormat(val)}
                  >
                    <SelectTrigger className="h-9 text-xs bg-slate-900 border-border/60">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/webp" className="text-xs">WebP (Recommended)</SelectItem>
                      <SelectItem value="image/png" className="text-xs">PNG (Lossless)</SelectItem>
                      <SelectItem value="image/jpeg" className="text-xs">JPEG (Compact)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Max Width (Resize)
                  </label>
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(e.target.value)}
                    placeholder="Auto (Original)"
                    className="w-full h-9 bg-slate-900 border border-border/60 rounded-md px-3 text-xs text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {result && (
                <Button
                  onClick={() => handleDownload(result)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs gap-2 py-2.5 shadow-lg shadow-indigo-600/20"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Processed Image ({formatFileSize(result.compressedSize)})</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Visual Split Slider & Comparison */}
        <Card className="lg:col-span-7 bg-card/60 backdrop-blur-md border-border/50 flex flex-col justify-between">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Before vs. After Split Inspector</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Interactive comparison slider (Original on left, Compressed on right)
              </CardDescription>
            </div>

            {result && (
              <Badge
                variant="outline"
                className={`text-xs px-2.5 py-1 ${
                  calculateSavings() >= 0
                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                    : 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                }`}
              >
                {calculateSavings() >= 0 ? `${calculateSavings()}% Smaller` : 'Larger Format'}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {previewOriginalUrl && result ? (
              <div className="space-y-4">
                {/* Visual Split Overlay */}
                <div 
                  className="relative h-[340px] w-full rounded-xl overflow-hidden border border-border/60 bg-slate-950/80 select-none cursor-ew-resize"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    setSplitPos((x / rect.width) * 100);
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
                    setSplitPos((x / rect.width) * 100);
                  }}
                >
                  {/* Processed Compressed Image (Background) */}
                  <img
                    src={result.dataUrl}
                    alt="Processed"
                    className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                  />

                  {/* Original Image (Clipped Overlay) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-indigo-400 shadow-2xl"
                    style={{ width: `${splitPos}%` }}
                  >
                    <img
                      src={previewOriginalUrl}
                      alt="Original"
                      className="absolute inset-0 h-full w-full object-contain pointer-events-none max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>

                  {/* Split Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-indigo-400 cursor-ew-resize flex items-center justify-center shadow-lg"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="h-8 w-5 bg-indigo-500 text-white rounded-md text-[10px] flex items-center justify-center shadow-md">
                      ↔
                    </div>
                  </div>

                  {/* Corner Labels */}
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono backdrop-blur-md">
                    Original: {formatFileSize(result.originalSize)}
                  </span>
                  <span className="absolute top-3 right-3 bg-black/60 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono backdrop-blur-md font-bold">
                    Compressed: {formatFileSize(result.compressedSize)}
                  </span>
                </div>

                {/* File Details Summary */}
                <div className="grid grid-cols-3 gap-3 text-center p-3 rounded-xl bg-slate-900/80 border border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Original Dimensions</span>
                    <span className="font-mono font-bold text-foreground">{result.width} x {result.height} px</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Savings</span>
                    <span className="font-mono font-bold text-emerald-400">{formatFileSize(result.originalSize - result.compressedSize)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Format</span>
                    <span className="font-mono font-bold text-indigo-400 uppercase">{result.format.split('/')[1]}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[340px] rounded-xl border border-dashed border-border/60 bg-slate-950/30 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <FileImage className="h-12 w-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold">No Image Selected</p>
                <p className="text-xs max-w-xs mt-1">
                  Upload an image on the left panel to trigger live quality compression and split preview.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History Log Section */}
      <Card className="bg-card/60 backdrop-blur-md border-border/50">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-400" />
            <span>Recent Compressed History (IndexedDB Storage)</span>
          </CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await Storage.clearAllHistory();
                loadHistory();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border/50 bg-slate-900/60 flex items-center justify-between gap-3 text-xs hover:border-indigo-500/40 transition-colors"
                >
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover bg-slate-950"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {formatFileSize(item.compressedSize)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(item)}
                      className="h-7 w-7 text-indigo-400 hover:bg-indigo-500/20"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="h-7 w-7 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              No recent conversion history stored yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
