'use client';

import { useCallback } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useChatlogStore } from '@/store/chatlog-store';
import { BackgroundColorPicker } from './background-color-picker';

interface EditorToolbarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function EditorToolbar({ previewRef }: EditorToolbarProps) {
  const fontSize = useChatlogStore((s) => s.fontSize);
  const setFontSize = useChatlogStore((s) => s.setFontSize);
  const incrementFontSize = useChatlogStore((s) => s.incrementFontSize);
  const decrementFontSize = useChatlogStore((s) => s.decrementFontSize);
  const resetFontSize = useChatlogStore((s) => s.resetFontSize);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2 });
      const timestamp = new Date()
        .toLocaleString()
        .replaceAll(',', '_')
        .replaceAll(' ', '_')
        .replaceAll('/', '-')
        .replace('__', '_')
        .replaceAll(':', '-');
      saveAs(dataUrl, `${timestamp}_chatlog.png`);
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  }, [previewRef]);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Font size controls */}
      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">Font Size</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={decrementFontSize}
              className="h-8 w-8"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Decrease font size</TooltipContent>
        </Tooltip>

        <Slider
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value)}
          min={8}
          max={32}
          step={1}
          className="w-[120px]"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementFontSize}
              className="h-8 w-8"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Increase font size</TooltipContent>
        </Tooltip>

        <span className="text-sm text-muted-foreground w-10 text-center">
          {fontSize}px
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetFontSize}
              className="h-8 w-8"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset font size</TooltipContent>
        </Tooltip>
      </div>

      {/* Background color */}
      <BackgroundColorPicker />

      {/* Download button */}
      <Button onClick={handleDownload} className="ml-auto">
        <Download className="mr-2 h-4 w-4" />
        Download Image
      </Button>
    </div>
  );
}
