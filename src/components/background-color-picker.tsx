'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useChatlogStore } from '@/store/chatlog-store';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const COLOR_PRESETS = [
  { name: 'Charcoal', value: '#323131' },
  { name: 'Black', value: '#0a0a0a' },
  { name: 'Navy', value: '#0f172a' },
];

export function BackgroundColorPicker() {
  const backgroundColor = useChatlogStore((s) => s.backgroundColor);
  const setBackgroundColor = useChatlogStore((s) => s.setBackgroundColor);
  const resetBackgroundColor = useChatlogStore((s) => s.resetBackgroundColor);
  const isTransparent = useChatlogStore((s) => s.isTransparent);
  const toggleTransparent = useChatlogStore((s) => s.toggleTransparent);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="bg-color" className="text-xs font-medium text-muted-foreground">
          Background:
        </Label>

        {/* Preset Swatches */}
        <div className="flex items-center gap-1.5">
          {COLOR_PRESETS.map((preset) => (
            <Tooltip key={preset.value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setBackgroundColor(preset.value)}
                  className={cn(
                    'h-5 w-5 rounded-full border border-border transition-transform active:scale-95',
                    !isTransparent && backgroundColor.toLowerCase() === preset.value.toLowerCase() &&
                      'ring-2 ring-foreground ring-offset-1 ring-offset-background',
                  )}
                  style={{ backgroundColor: preset.value }}
                  aria-label={`Set background color to ${preset.name}`}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {preset.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Native Color Input */}
        <input
          id="bg-color"
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          disabled={isTransparent}
          className={cn(
            'h-6 w-6 cursor-pointer rounded border border-border bg-transparent p-0 transition-opacity',
            isTransparent && 'cursor-not-allowed opacity-30',
          )}
          title="Custom color"
          aria-label="Custom background color"
        />
      </div>

      {/* Transparent Toggle */}
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant={isTransparent ? 'secondary' : 'ghost'}
          size="sm"
          onClick={toggleTransparent}
          className={cn(
            'h-7 px-2.5 text-xs font-medium',
            isTransparent && 'bg-secondary font-semibold text-foreground',
          )}
        >
          Transparent
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Reset background color to default"
              onClick={resetBackgroundColor}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Reset background</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
