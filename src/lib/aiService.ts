import { ExtractedColor, AppSettings } from './types';

export async function generateAiDesignCode(
  prompt: string,
  colors: ExtractedColor[],
  settings: AppSettings
): Promise<string> {
  const paletteDescription = colors
    .map(c => `${c.name || 'Color'}: ${c.hex} (${c.isLight ? 'Light' : 'Dark'})`)
    .join(', ');

  const systemPrompt = `You are a Principal Frontend & UI System Engineer. Generate clean, responsive, production-grade component code matching the user request.
Primary Color Palette provided:
${paletteDescription}

Constraints:
- Return ONLY runnable JSX / React or HTML/Tailwind CSS code inside a clean markdown block.
- Use inline Tailwind CSS classes matching these hex colors or closest standard Tailwind colors where applicable.
- Make it beautifully formatted with dark developer aesthetic.`;

  // 1. OpenAI Integration
  if (settings.preferredAiProvider === 'openai' && settings.openaiApiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API error: ${res.statusText}`);
      }

      const data = await res.json();
      return data.choices[0]?.message?.content || 'No response generated.';
    } catch (err: unknown) {
      console.warn('OpenAI request failed, switching to offline fallback template:', err);
    }
  }

  // 2. Gemini Integration
  if (settings.preferredAiProvider === 'gemini' && settings.geminiApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\nUser Request: ${prompt}` }
              ]
            }
          ]
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.statusText}`);
      }

      const data = await res.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated.';
    } catch (err: unknown) {
      console.warn('Gemini request failed, falling back to offline mode:', err);
    }
  }

  // 3. Smart Offline Fallback Code Templates
  return getOfflineCodeTemplate(prompt, colors);
}

function getOfflineCodeTemplate(prompt: string, colors: ExtractedColor[]): string {
  const c1 = colors[0]?.hex || '#6366f1';
  const c2 = colors[1]?.hex || '#06b6d4';
  const c3 = colors[2]?.hex || '#f43f5e';
  const bg = colors[5]?.hex || '#0f172a';

  const lower = prompt.toLowerCase();

  if (lower.includes('card') || lower.includes('pricing') || lower.includes('profile')) {
    return `// Offline Generated React + Tailwind Component
import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FeatureCard() {
  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/80 text-white relative overflow-hidden">
      {/* Glow highlight derived from palette */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: '${c1}' }}
      />

      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-3 rounded-xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: '${c1}22', color: '${c1}' }}
        >
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pro Feature</span>
          <h3 className="text-xl font-bold">Asset Studio Dashboard</h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        Streamlined asset generation, color quantization, and client-side web compilation inside your browser runtime.
      </p>

      <ul className="space-y-2 mb-6 text-sm text-slate-300">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Canvas 2D Color Extraction Engine</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>WCAG 2.1 Accessibility Matrix</span>
        </li>
      </ul>

      <button
        className="w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
        style={{ backgroundColor: '${c1}', color: '#ffffff' }}
      >
        <span>Get Started Pro</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}`;
  }

  return `// Offline Generated React Layout Snippet
import React from 'react';

export function ModernPaletteHeader() {
  return (
    <header 
      className="w-full p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
      style={{ backgroundColor: '${bg}' }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '${c1}' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '${c2}' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '${c3}' }} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Custom Design System
        </h1>
        <p className="text-slate-400 text-sm">
          Auto-configured from your uploaded screenshot theme palette.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          className="px-5 py-2.5 rounded-lg font-medium text-sm border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
        >
          View Documentation
        </button>
        <button 
          className="px-5 py-2.5 rounded-lg font-medium text-sm text-white shadow-lg hover:brightness-110 transition"
          style={{ backgroundColor: '${c1}' }}
        >
          Export Theme
        </button>
      </div>
    </header>
  );
}`;
}
