'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toBlob, toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import {
  Check,
  ClipboardCopy,
  Download,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';
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

interface CanvasExportButtonsProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

export function CanvasExportButtons({ previewRef, disabled = false }: CanvasExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'download' | 'copy' | null>(null);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || isExporting || disabled) return;
    setIsExporting(true);
    setExportType('download');

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
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [previewRef, isExporting, disabled]);

  const handleCopy = useCallback(async () => {
    if (!previewRef.current || isExporting || disabled) return;
    setIsExporting(true);
    setExportType('copy');

    try {
      const blob = await toBlob(previewRef.current, { pixelRatio: 2 });
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy image:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [previewRef, isExporting, disabled]);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleCopy}
        disabled={disabled || isExporting}
        className="h-8 gap-2 px-3 text-xs font-medium shadow-sm hover:bg-muted"
      >
        <AnimatePresence mode="wait" initial={false}>
          {exportType === 'copy' ? (
            <span key="loading" className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Copying...
            </span>
          ) : copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-3.5 w-3.5" />
              Copied
            </motion.span>
          ) : (
            <span key="default" className="flex items-center gap-1.5">
              <ClipboardCopy className="h-3.5 w-3.5 text-muted-foreground" />
              Copy Image
            </span>
          )}
        </AnimatePresence>
      </Button>

      <Button
        type="button"
        onClick={handleDownload}
        disabled={disabled || isExporting}
        className="h-8 gap-2 bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
      >
        {exportType === 'download' ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </>
        )}
      </Button>
    </div>
  );
}

export function EditorToolbar() {
  const fontSize = useChatlogStore((s) => s.fontSize);
  const setFontSize = useChatlogStore((s) => s.setFontSize);
  const incrementFontSize = useChatlogStore((s) => s.incrementFontSize);
  const decrementFontSize = useChatlogStore((s) => s.decrementFontSize);
  const resetFontSize = useChatlogStore((s) => s.resetFontSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-3.5 py-2.5">
      {/* Font size */}
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Font:
        </Label>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Decrease font size"
          onClick={decrementFontSize}
          className="h-7 w-7 rounded"
        >
          <Minus className="h-3 w-3" />
        </Button>

        <Slider
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value)}
          min={11}
          max={32}
          step={1}
          className="w-[80px] sm:w-[100px]"
          aria-label="Font size slider"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Increase font size"
          onClick={incrementFontSize}
          className="h-7 w-7 rounded"
        >
          <Plus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center font-mono text-xs font-medium text-foreground">
          {fontSize}px
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Reset font size"
              onClick={resetFontSize}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Reset size (15px)</TooltipContent>
        </Tooltip>
      </div>

      <div className="hidden h-4 w-px bg-border sm:block" />

      {/* Background picker */}
      <BackgroundColorPicker />
    </div>
  );
}
