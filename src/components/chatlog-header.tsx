'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { useChatlogStore } from '@/store/chatlog-store';
import { useMemo } from 'react';
import { parseChat } from '@/lib/chat-parser';

export function ChatlogHeader() {
  const rawText = useChatlogStore((s) => s.rawText);

  const lineCount = useMemo(() => {
    if (!rawText.trim()) return 0;
    return parseChat(rawText).filter((l) => l.text.trim().length > 0).length;
  }, [rawText]);

  return (
    <header className="mb-6 flex items-center justify-between border-b border-border/70 pb-4">
      <div className="flex items-baseline gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Chatlog Editor
        </h1>
        <span className="text-xs text-muted-foreground">
          GTA RP screenshot exporter
        </span>
        {lineCount > 0 && (
          <span className="text-xs text-muted-foreground/80 font-mono">
            ({lineCount} {lineCount === 1 ? 'line' : 'lines'})
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
