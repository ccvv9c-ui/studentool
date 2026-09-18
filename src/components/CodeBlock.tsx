import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'css', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-slate-950/90 overflow-hidden shadow-lg font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-slate-900/60 text-slate-400">
        <span className="font-semibold text-[11px] uppercase tracking-wider">{title || language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed max-h-80">
        <pre>{code}</pre>
      </div>
    </div>
  );
};
