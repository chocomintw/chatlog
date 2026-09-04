'use client';

import { useMemo } from 'react';
import { useChatlogStore } from '@/store/chatlog-store';
import { parseChat } from '@/lib/chat-parser';

export function DetectedTypes() {
  const rawText = useChatlogStore((s) => s.rawText);

  const matchedRules = useMemo(() => {
    if (!rawText.trim()) return [];
    const lines = parseChat(rawText);
    const seen = new Map<string, { label: string; color: string; count: number }>();

    for (const l of lines) {
      if (l.rule) {
        const existing = seen.get(l.rule.id);
        if (existing) {
          existing.count++;
        } else {
          seen.set(l.rule.id, {
            label: l.rule.label,
            color: l.rule.color,
            count: 1,
          });
        }
      }
    }

    return Array.from(seen.values());
  }, [rawText]);

  if (matchedRules.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground/70">Detected:</span>
      {matchedRules.map((r) => (
        <span
          key={r.label}
          className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 font-medium text-foreground"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: r.color }}
          />
          <span>{r.label}</span>
          <span className="font-mono text-muted-foreground">({r.count})</span>
        </span>
      ))}
    </div>
  );
}
