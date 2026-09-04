'use client';

import { forwardRef, useMemo } from 'react';
import { parseChat } from '@/lib/chat-parser';
import { useChatlogStore } from '@/store/chatlog-store';
import { ChatlogLine } from './chatlog-line';

export const ChatlogPreview = forwardRef<HTMLDivElement>(
  function ChatlogPreview(_, ref) {
    const rawText = useChatlogStore((s) => s.rawText);
    const backgroundColor = useChatlogStore((s) => s.backgroundColor);

    const lines = useMemo(() => parseChat(rawText), [rawText]);

    return (
      <div
        ref={ref}
        className="inline-block min-h-[100px] w-auto min-w-full rounded-lg p-4"
        style={{ backgroundColor }}
      >
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Paste your chatlog below to see a preview...
          </p>
        ) : (
          lines.map((line, index) => <ChatlogLine key={index} line={line} />)
        )}
      </div>
    );
  },
);
