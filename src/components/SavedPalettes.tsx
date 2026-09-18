import React from 'react';
import { FolderHeart, Trash2, Copy, Check, Download, Layers } from 'lucide-react';
import { SavedPalette, ExtractedColor } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

interface SavedPalettesProps {
  palettes: SavedPalette[];
  onDeletePalette: (id: string) => void;
  onSelectPalette: (colors: ExtractedColor[]) => void;
}

export const SavedPalettes: React.FC<SavedPalettesProps> = ({
  palettes,
  onDeletePalette,
  onSelectPalette,
}) => {
  const exportAllAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(palettes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `assetstudio_palettes_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-md border-border/50">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FolderHeart className="h-5 w-5 text-indigo-400" />
              <span>Saved Palettes Library</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Manage and export your saved local design palettes
            </CardDescription>
          </div>

          {palettes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportAllAsJson}
              className="gap-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {palettes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {palettes.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border/60 bg-slate-900/60 p-4 space-y-4 hover:border-indigo-500/50 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{p.name}</h4>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeletePalette(p.id)}
                      className="h-8 w-8 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Swatches Bar */}
                  <div className="h-12 w-full rounded-lg overflow-hidden flex shadow-inner">
                    {p.colors.map((c, i) => (
                      <div
                        key={i}
                        className="h-full flex-1 transition-transform hover:scale-105"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name}: ${c.hex}`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectPalette(p.colors)}
                    className="w-full text-xs font-semibold gap-1.5"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Load Palette into Studio</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <FolderHeart className="h-10 w-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No Saved Palettes Yet</p>
              <p className="text-xs">
                Extract color swatches from images in the Color Studio tab and click "Save Palette".
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
