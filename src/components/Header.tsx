import React from 'react';
import { 
  Zap, 
  Palette, 
  FileImage, 
  Sliders, 
  Sparkles, 
  FolderHeart, 
  Settings, 
  WifiOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  savedPalettesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  savedPalettesCount,
}) => {
  const tabs = [
    { id: 'palette', label: 'Color Studio', icon: Palette },
    { id: 'compress', label: 'Image Compressor', icon: FileImage },
    { id: 'css', label: 'CSS Generator', icon: Sliders },
    { id: 'ai', label: 'AI Inspector', icon: Sparkles },
    { id: 'library', label: 'Library', icon: FolderHeart, badge: savedPalettesCount > 0 ? savedPalettesCount : null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('palette')}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                AssetStudio<span className="text-indigo-400">.Pro</span>
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-indigo-500/30 text-indigo-400 font-mono">
                CLIENT-SIDE
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Client-side Color & Image Web Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-150 ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span className="ml-1 bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full border border-border/50">
            <WifiOff className="h-3 w-3 text-emerald-400" />
            <span className="text-[11px] font-medium">100% Offline Ready</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
            title="Studio Settings & API Keys"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="md:hidden border-t border-border/40 px-2 py-1.5 flex items-center justify-around overflow-x-auto bg-background/95">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 min-w-[60px] ${
                isActive ? 'text-indigo-400 bg-accent/60' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
