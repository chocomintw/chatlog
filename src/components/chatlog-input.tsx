'use client';

import { Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatlogStore } from '@/store/chatlog-store';
import { SAMPLE_GTA_CHATLOG } from '@/lib/sample-logs';
import { CharacterHighlight } from './character-highlight';
import { DetectedTypes } from './detected-types';

export function ChatlogInput() {
  const rawText = useChatlogStore((s) => s.rawText);
  const setRawText = useChatlogStore((s) => s.setRawText);
  const characterName = useChatlogStore((s) => s.characterName);
  const characterColoringEnabled = useChatlogStore((s) => s.characterColoringEnabled);

  const linesCount = rawText.trim() ? rawText.split('\n').filter((l) => l.trim().length > 0).length : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Input Header: Character Controls + Text Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-3.5 py-2.5">
        {/* Left: Character Identity & Highlighting */}
        <CharacterHighlight />

        {/* Right: Quick Text Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setRawText(SAMPLE_GTA_CHATLOG);
            }}
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Sample Log</span>
          </Button>

          {rawText && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setRawText('');
              }}
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Textarea Area */}
      <label htmlFor="chatlog-textarea" className="sr-only">
        Chatlog text
      </label>
      <Textarea
        id="chatlog-textarea"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste your GTA RP chatlog lines here..."
        className="min-h-[160px] resize-y rounded-none border-0 bg-transparent p-3.5 font-mono text-xs leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
        spellCheck={false}
      />

      {/* Input Footer: Stats, Detected Rules & Active Character Status */}
      <div className="flex flex-col gap-1.5 border-t border-border/70 bg-muted/20 px-3.5 py-1.5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            {linesCount} {linesCount === 1 ? 'line' : 'lines'} • {rawText.length.toLocaleString()} characters
          </span>
          {characterName && characterColoringEnabled && (
            <span className="font-medium text-foreground/80">
              Highlighting: <span className="font-semibold text-primary">{characterName}</span>
            </span>
          )}
        </div>
        <DetectedTypes />
      </div>
    </div>
  );
}
