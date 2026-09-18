import React, { useState } from 'react';
import { Sliders, Sparkles, Copy, Check, Box, Layers, Frame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { CodeBlock } from './CodeBlock';

export const CssStudio: React.FC = () => {
  // Shadow state
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(20);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [shadowColor, setShadowColor] = useState('#6366f1');
  const [shadowOpacity, setShadowOpacity] = useState(0.25);

  // Gradient state
  const [gradAngle, setGradAngle] = useState(135);
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#a855f7');
  const [color3, setColor3] = useState('#ec4899');

  // Glassmorphism state
  const [glassBlur, setGlassBlur] = useState(16);
  const [glassBgOpacity, setGlassBgOpacity] = useState(0.15);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(0.2);

  // Generate CSS code strings
  const shadowCss = `box-shadow: ${shadowX}px ${shadowY}px ${blur}px ${spread}px ${shadowColor}${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')};`;
  const gradientCss = `background: linear-gradient(${gradAngle}deg, ${color1}, ${color2}, ${color3});`;
  const glassCss = `background: rgba(255, 255, 255, ${glassBgOpacity});
backdrop-filter: blur(${glassBlur}px);
-webkit-backdrop-filter: blur(${glassBlur}px);
border: 1px solid rgba(255, 255, 255, ${glassBorderOpacity});`;

  return (
    <div className="space-y-8">
      <Card className="bg-card/60 backdrop-blur-md border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-indigo-400" />
            <span>CSS & SVG Visual Exporter</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Generate complex modern CSS shadows, glassmorphism, and multi-stop gradients with one-click code copy
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="shadow" className="w-full">
            <TabsList className="mb-6 bg-slate-900/80 p-1">
              <TabsTrigger value="shadow" className="text-xs gap-1.5">
                <Box className="h-3.5 w-3.5" />
                <span>Box Shadow</span>
              </TabsTrigger>
              <TabsTrigger value="gradient" className="text-xs gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>Linear Gradient</span>
              </TabsTrigger>
              <TabsTrigger value="glass" className="text-xs gap-1.5">
                <Frame className="h-3.5 w-3.5" />
                <span>Glassmorphism</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Box Shadow */}
            <TabsContent value="shadow" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Interactive Sliders */}
                <div className="lg:col-span-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Horizontal Offset (X)</span>
                      <span className="font-mono text-indigo-400">{shadowX}px</span>
                    </div>
                    <Slider value={[shadowX]} min={-50} max={50} onValueChange={(v) => setShadowX(v[0])} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Vertical Offset (Y)</span>
                      <span className="font-mono text-indigo-400">{shadowY}px</span>
                    </div>
                    <Slider value={[shadowY]} min={-50} max={50} onValueChange={(v) => setShadowY(v[0])} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Blur Radius</span>
                      <span className="font-mono text-indigo-400">{blur}px</span>
                    </div>
                    <Slider value={[blur]} min={0} max={100} onValueChange={(v) => setBlur(v[0])} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Spread Radius</span>
                      <span className="font-mono text-indigo-400">{spread}px</span>
                    </div>
                    <Slider value={[spread]} min={-30} max={30} onValueChange={(v) => setSpread(v[0])} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Shadow Color</label>
                      <input
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="h-9 w-full rounded-md border border-border/60 bg-slate-900 cursor-pointer p-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Opacity</label>
                      <Slider value={[shadowOpacity]} min={0} max={1} step={0.01} onValueChange={(v) => setShadowOpacity(v[0])} />
                    </div>
                  </div>
                </div>

                {/* Live Box Shadow Preview */}
                <div className="lg:col-span-6 bg-slate-950/80 rounded-xl p-8 flex items-center justify-center min-h-[260px] border border-border/40">
                  <div
                    className="w-44 h-44 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white transition-all"
                    style={{
                      boxShadow: `${shadowX}px ${shadowY}px ${blur}px ${spread}px ${shadowColor}${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`,
                    }}
                  >
                    Shadow Canvas Box
                  </div>
                </div>
              </div>

              <CodeBlock code={shadowCss} language="css" title="CSS Box Shadow Output" />
            </TabsContent>

            {/* TAB 2: Linear Gradient */}
            <TabsContent value="gradient" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Angle ({gradAngle} deg)</span>
                    </div>
                    <Slider value={[gradAngle]} min={0} max={360} onValueChange={(v) => setGradAngle(v[0])} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Stop 1</label>
                      <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-9 w-full rounded-md bg-slate-900 cursor-pointer p-1" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Stop 2</label>
                      <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-9 w-full rounded-md bg-slate-900 cursor-pointer p-1" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Stop 3</label>
                      <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} className="h-9 w-full rounded-md bg-slate-900 cursor-pointer p-1" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950/80 rounded-xl p-8 flex items-center justify-center min-h-[260px] border border-border/40">
                  <div
                    className="w-full h-44 rounded-2xl shadow-xl flex items-center justify-center text-xs font-extrabold text-white uppercase tracking-wider"
                    style={{
                      background: `linear-gradient(${gradAngle}deg, ${color1}, ${color2}, ${color3})`,
                    }}
                  >
                    Multi-Stop Gradient
                  </div>
                </div>
              </div>

              <CodeBlock code={gradientCss} language="css" title="CSS Linear Gradient Output" />
            </TabsContent>

            {/* TAB 3: Glassmorphism */}
            <TabsContent value="glass" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Backdrop Blur ({glassBlur}px)</span>
                    </div>
                    <Slider value={[glassBlur]} min={0} max={40} onValueChange={(v) => setGlassBlur(v[0])} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                      <span>Background Opacity ({Math.round(glassBgOpacity * 100)}%)</span>
                    </div>
                    <Slider value={[glassBgOpacity]} min={0} max={0.8} step={0.01} onValueChange={(v) => setGlassBgOpacity(v[0])} />
                  </div>
                </div>

                {/* Glassmorphism Preview */}
                <div className="lg:col-span-6 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 flex items-center justify-center min-h-[260px] relative overflow-hidden">
                  <div
                    className="w-64 p-6 rounded-2xl text-white shadow-2xl relative z-10"
                    style={{
                      background: `rgba(255, 255, 255, ${glassBgOpacity})`,
                      backdropFilter: `blur(${glassBlur}px)`,
                      WebkitBackdropFilter: `blur(${glassBlur}px)`,
                      border: `1px solid rgba(255, 255, 255, ${glassBorderOpacity})`,
                    }}
                  >
                    <p className="text-sm font-bold">Glassmorphic Card</p>
                    <p className="text-xs text-white/80 mt-1">
                      Blended frosted glass UI container effect.
                    </p>
                  </div>
                </div>
              </div>

              <CodeBlock code={glassCss} language="css" title="CSS Glassmorphism Output" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
