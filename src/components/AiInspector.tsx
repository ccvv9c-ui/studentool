import React, { useState } from 'react';
import { Sparkles, Code2, Play, Cpu, AlertCircle, Check } from 'lucide-react';
import { ExtractedColor, AppSettings } from '../lib/types';
import { generateAiDesignCode } from '../lib/aiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CodeBlock } from './CodeBlock';

interface AiInspectorProps {
  colors: ExtractedColor[];
  settings: AppSettings;
  onOpenSettings: () => void;
}

export const AiInspector: React.FC<AiInspectorProps> = ({
  colors,
  settings,
  onOpenSettings,
}) => {
  const [prompt, setPrompt] = useState('Build a modern dark React card component with feature list and CTA button');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const presets = [
    'Build a Hero Section with gradient headline',
    'Build a Pricing Card with toggle and badges',
    'Build a User Profile Modal layout',
    'Build a Color Theme Navbar with status items',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const code = await generateAiDesignCode(prompt, colors, settings);
      setGeneratedCode(code);
    } catch (err) {
      console.error('AI code generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card/60 backdrop-blur-md border-border/50">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span>AI Component Inspector</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Generate React & Tailwind UI snippets tailored to your extracted studio palette
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className={`text-xs px-2.5 py-0.5 capitalize flex items-center gap-1.5 ${
              settings.preferredAiProvider !== 'offline'
                ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10'
                : 'border-slate-500/50 text-slate-400 bg-slate-500/10'
            }`}
          >
            <Cpu className="h-3 w-3" />
            <span>Mode: {settings.preferredAiProvider}</span>
          </Badge>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Active Colors Indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-border/40 text-xs">
            <span className="text-muted-foreground font-medium">Palette Context Injected into Prompt:</span>
            <div className="flex items-center gap-1.5">
              {colors.length > 0 ? (
                colors.map((c, i) => (
                  <span
                    key={i}
                    className="h-4 w-4 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name}: ${c.hex}`}
                  />
                ))
              ) : (
                <span className="text-slate-500 text-[11px]">No palette sampled yet (using default)</span>
              )}
            </div>
          </div>

          {/* Prompt Area */}
          <div className="space-y-3">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Generate a feature component using my palette colors..."
              className="w-full bg-slate-950 border border-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Preset Prompts:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  className="text-[11px] bg-secondary/60 hover:bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg transition-colors border border-border/40"
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs gap-2 py-2.5 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <span>Generating Code Snippet...</span>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Generate Design Code Snippet</span>
                </>
              )}
            </Button>
          </div>

          {/* Warning if provider is offline or missing keys */}
          {settings.preferredAiProvider === 'offline' && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>Running in Smart Offline Template Mode. Connect OpenAI or Gemini API Keys in Settings for live LLM generation.</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onOpenSettings} className="h-7 text-xs text-indigo-300 hover:bg-indigo-500/20">
                Configure Keys
              </Button>
            </div>
          )}

          {/* Generated Code Result */}
          {generatedCode && (
            <div className="pt-2">
              <CodeBlock code={generatedCode} language="jsx" title="AI Generated Component Snippet" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
