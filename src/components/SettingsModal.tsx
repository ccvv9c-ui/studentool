import React, { useState } from 'react';
import { Key, Shield, HardDrive, Check } from 'lucide-react';
import { AppSettings } from '../lib/types';
import { Storage } from '../lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey || '');
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [provider, setProvider] = useState<'openai' | 'gemini' | 'offline'>(settings.preferredAiProvider);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated: AppSettings = {
      ...settings,
      openaiApiKey: openaiKey,
      geminiApiKey: geminiKey,
      preferredAiProvider: provider,
    };
    Storage.saveSettings(updated);
    onSaveSettings(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span>Studio Preferences & API Keys</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Keys are stored strictly offline in your browser's local storage and never sent to external servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              Preferred AI Engine Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setProvider('offline')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  provider === 'offline'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-border/60 bg-slate-900 text-muted-foreground'
                }`}
              >
                Offline Template
              </button>
              <button
                onClick={() => setProvider('openai')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  provider === 'openai'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-border/60 bg-slate-900 text-muted-foreground'
                }`}
              >
                OpenAI (GPT-4)
              </button>
              <button
                onClick={() => setProvider('gemini')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  provider === 'gemini'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-border/60 bg-slate-900 text-muted-foreground'
                }`}
              >
                Google Gemini
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              OpenAI API Key
            </label>
            <div className="relative flex items-center">
              <Key className="h-4 w-4 absolute left-3 text-slate-500" />
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-slate-950 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Gemini API Key
            </label>
            <div className="relative flex items-center">
              <Key className="h-4 w-4 absolute left-3 text-slate-500" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5">
            {saved ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
