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

export function BackgroundColorPicker() {
  const backgroundColor = useChatlogStore((s) => s.backgroundColor);
  const setBackgroundColor = useChatlogStore((s) => s.setBackgroundColor);
  const resetBackgroundColor = useChatlogStore((s) => s.resetBackgroundColor);

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="bg-color" className="text-sm whitespace-nowrap">
        Background
      </Label>
      <input
        id="bg-color"
        type="color"
        value={backgroundColor}
        onChange={(e) => setBackgroundColor(e.target.value)}
        className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetBackgroundColor}
            className="h-8 w-8"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset background color</TooltipContent>
      </Tooltip>
    </div>
  );
}
