import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Palette, 
  Copy, 
  Check, 
  BookmarkPlus, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RefreshCw,
  Eye,
  Layers
} from 'lucide-react';
import { ExtractedColor, WCAGResult, SavedPalette } from '../lib/types';
import { 
  extractColorsFromCanvas, 
  calculateContrast, 
  generateCssVariables, 
  generateTailwindConfig 
} from '../lib/colorUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { CodeBlock } from './CodeBlock';

interface ColorStudioProps {
  onSavePalette: (palette: SavedPalette) => void;
  onUseInAi: (colors: ExtractedColor[]) => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

export const ColorStudio: React.FC<ColorStudioProps> = ({ onSavePalette, onUseInAi }) => {
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [imageSrc, setImageSrc] = useState<string>(DEFAULT_IMAGE);
  const [selectedForeground, setSelectedForeground] = useState<string>('#FFFFFF');
  const [selectedBackground, setSelectedBackground] = useState<string>('#0F172A');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [paletteName, setPaletteName] = useState('My Brand Palette');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Process image on canvas and extract colors
  const processImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const extracted = extractColorsFromCanvas(canvas, 6);
        setColors(extracted);
        if (extracted.length >= 2) {
          setSelectedForeground(extracted[0].hex);
          setSelectedBackground(extracted[extracted.length - 1].hex);
        }
      }
    };
  };

  useEffect(() => {
    processImage(imageSrc);
  }, [imageSrc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImageSrc(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImageSrc(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const contrastResult: WCAGResult = calculateContrast(selectedForeground, selectedBackground);

  const handleSaveCurrentPalette = () => {
    if (!colors.length) return;
    const newPalette: SavedPalette = {
      id: `pal_${Date.now()}`,
      name: paletteName || 'Custom Palette',
      colors,
      createdAt: Date.now(),
      tags: ['Extracted', 'Studio'],
    };
    onSavePalette(newPalette);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Drag-Drop & Canvas Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Canvas Preview & Drop Zone */}
        <Card className="lg:col-span-7 bg-card/60 backdrop-blur-md border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-400" />
                <span>Image Color Sampling</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Drag and drop design screenshots or images to parse pixel palettes
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 text-xs"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Image</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </CardHeader>

          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative group rounded-xl border-2 border-dashed border-border/80 hover:border-indigo-500/50 bg-slate-950/40 p-2 flex items-center justify-center min-h-[320px] max-h-[420px] overflow-hidden transition-all duration-200"
            >
              <img
                src={imageSrc}
                alt="Source preview"
                className="max-h-[380px] w-auto object-contain rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center backdrop-blur-xs">
                <Upload className="h-8 w-8 text-indigo-400 mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-white">Drop new image here</p>
                <p className="text-xs text-slate-300">Supports PNG, JPG, WebP, SVG</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Dominant Swatches parsed via Canvas ImageData</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => processImage(imageSrc)}
                className="h-7 text-xs gap-1 hover:text-indigo-400"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Re-analyze</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Extracted Swatches & Palette Actions */}
        <Card className="lg:col-span-5 bg-card/60 backdrop-blur-md border-border/50 flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-400" />
                  <span>Extracted Palette</span>
                </CardTitle>

                <Button
                  size="sm"
                  onClick={handleSaveCurrentPalette}
                  disabled={savedSuccess}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 text-xs shadow-md shadow-indigo-600/20"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="h-3.5 w-3.5" />
                      <span>Save Palette</span>
                    </>
                  )}
                </Button>
              </div>
              <CardDescription className="text-xs">
                Extracted using k-means pixel bucket quantization
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Swatch Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colors.map((c, index) => (
                  <div
                    key={index}
                    onClick={() => copyHex(c.hex)}
                    className="group relative rounded-xl border border-border/60 bg-slate-900/50 p-2 cursor-pointer hover:border-indigo-500/60 hover:shadow-lg transition-all"
                  >
                    <div
                      className="h-16 w-full rounded-lg mb-2 shadow-inner transition-transform group-hover:scale-[1.02] flex items-end justify-end p-1.5"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-md font-bold"
                        style={{
                          backgroundColor: c.isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
                          color: c.isLight ? '#fff' : '#000',
                        }}
                      >
                        {c.percentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-foreground leading-none mb-1">
                          {c.name || `Color ${index + 1}`}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground">{c.hex}</p>
                      </div>

                      <div className="text-muted-foreground group-hover:text-indigo-400">
                        {copiedHex === c.hex ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action bar to launch AI prompt using colors */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => onUseInAi(colors)}
                  className="w-full justify-center gap-2 border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/10 text-xs font-semibold text-indigo-300"
                >
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Generate Component Layout with AI Inspector</span>
                </Button>
              </div>
            </CardContent>
          </div>

          {/* Bottom Rename input */}
          <div className="p-4 border-t border-border/40 bg-secondary/20">
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Palette Label Name
            </label>
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="w-full bg-background border border-border/60 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500"
              placeholder="Enter name for library..."
            />
          </div>
        </Card>
      </div>

      {/* WCAG Contrast Matrix & Code Snippet Exporters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WCAG Contrast Checker Panel */}
        <Card className="lg:col-span-5 bg-card/60 backdrop-blur-md border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-400" />
              <span>WCAG 2.1 Accessibility Contrast Matrix</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Select foreground and background colors to test compliance ratios
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Color Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-border/60 p-1.5 rounded-lg">
                  <input
                    type="color"
                    value={selectedForeground}
                    onChange={(e) => setSelectedForeground(e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={selectedForeground}
                    onChange={(e) => setSelectedForeground(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-foreground uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-border/60 p-1.5 rounded-lg">
                  <input
                    type="color"
                    value={selectedBackground}
                    onChange={(e) => setSelectedBackground(e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={selectedBackground}
                    onChange={(e) => setSelectedBackground(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-foreground uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Contrast Preview Box */}
            <div
              className="p-4 rounded-xl border border-white/10 transition-colors shadow-inner flex flex-col justify-between min-h-[110px]"
              style={{ backgroundColor: selectedBackground, color: selectedForeground }}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 block">
                  Live Typography Preview
                </span>
                <p className="text-lg font-extrabold mt-1">
                  Sample Heading Text
                </p>
                <p className="text-xs opacity-90 mt-0.5">
                  Readable text test snippet against selected background.
                </p>
              </div>
            </div>

            {/* WCAG Score Breakdown */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Contrast Ratio</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-foreground">
                    {contrastResult.ratio} : 1
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      contrastResult.scoreLabel === 'Excellent'
                        ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                        : contrastResult.scoreLabel === 'Good'
                        ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                        : 'border-rose-500/50 text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {contrastResult.scoreLabel}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                <div className="flex items-center justify-between p-2 rounded-lg bg-background/40">
                  <span className="text-muted-foreground">AA Normal Text</span>
                  {contrastResult.AA_Normal ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-background/40">
                  <span className="text-muted-foreground">AA Large Text</span>
                  {contrastResult.AA_Large ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-background/40">
                  <span className="text-muted-foreground">AAA Normal Text</span>
                  {contrastResult.AAA_Normal ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-background/40">
                  <span className="text-muted-foreground">AAA Large Text</span>
                  {contrastResult.AAA_Large ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Snippets Panel (CSS Vars / Tailwind Config) */}
        <Card className="lg:col-span-7 bg-card/60 backdrop-blur-md border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Theme & Code Generator</CardTitle>
            <CardDescription className="text-xs">
              Instant CSS variables and Tailwind v3 configuration snippets
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="css" className="w-full">
              <TabsList className="mb-3 bg-slate-900/80 p-1">
                <TabsTrigger value="css" className="text-xs">
                  CSS Variables (:root)
                </TabsTrigger>
                <TabsTrigger value="tailwind" className="text-xs">
                  Tailwind CSS Config
                </TabsTrigger>
              </TabsList>

              <TabsContent value="css">
                <CodeBlock code={generateCssVariables(colors)} language="css" title="styles/variables.css" />
              </TabsContent>

              <TabsContent value="tailwind">
                <CodeBlock code={generateTailwindConfig(colors)} language="javascript" title="tailwind.config.js" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
