'use client';

import { Textarea } from '@/components/ui/textarea';
import { useChatlogStore } from '@/store/chatlog-store';

export function ChatlogInput() {
  const rawText = useChatlogStore((s) => s.rawText);
  const setRawText = useChatlogStore((s) => s.setRawText);

  return (
    <Textarea
      value={rawText}
      onChange={(e) => setRawText(e.target.value)}
      placeholder="Paste your GTA RP chatlog here..."
      className="min-h-[200px] resize-y font-mono text-sm"
    />
  );
}
