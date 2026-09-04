'use client';

import { memo } from 'react';
import type { ParsedLine } from '@/lib/chat-parser';
import { CHAT_COLORS } from '@/lib/chat-colors';
import { useChatlogStore } from '@/store/chatlog-store';

interface ChatlogLineProps {
  line: ParsedLine;
}

export const ChatlogLine = memo(function ChatlogLine({ line }: ChatlogLineProps) {
  const fontSize = useChatlogStore((s) => s.fontSize);
  const style = { fontSize: `${fontSize}px` };

  // Character Kill: "[Character kill] " in blue, rest in red
  if (line.ruleId === 'ck') {
    return (
      <div className="chatlog-line" style={style}>
        <span style={{ color: CHAT_COLORS.ckBlue }}>{'[Character kill] '}</span>
        <span style={{ color: CHAT_COLORS.ckRed }}>{line.text.slice(17)}</span>
      </div>
    );
  }

  // Info: "[INFO]: " in blue, next word in orange, rest in white
  if (line.ruleId === 'info') {
    const withoutPrefix = line.text.slice(8); // after "[INFO]: "
    const spaceIndex = withoutPrefix.indexOf(' ');
    const firstWord = spaceIndex === -1 ? withoutPrefix : withoutPrefix.slice(0, spaceIndex);
    const rest = spaceIndex === -1 ? '' : withoutPrefix.slice(spaceIndex);

    return (
      <div className="chatlog-line" style={style}>
        <span style={{ color: CHAT_COLORS.infoBlue }}>{'[INFO]: '}</span>
        <span style={{ color: CHAT_COLORS.infoOrange }}>{firstWord}</span>
        <span style={{ color: CHAT_COLORS.default }}>{rest}</span>
      </div>
    );
  }

  // Standard single-color line
  const color = line.rule?.color ?? CHAT_COLORS.default;

  return (
    <div className="chatlog-line" style={{ ...style, color }}>
      {line.text}
    </div>
  );
});
