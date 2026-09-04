'use client';

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { parseChat } from '@/lib/chat-parser';
import { useChatlogStore } from '@/store/chatlog-store';
import { ChatlogLine } from './chatlog-line';
import { SAMPLE_GTA_CHATLOG } from '@/lib/sample-logs';
import { EditorToolbar, CanvasExportButtons } from './editor-toolbar';

export interface ChatlogPreviewProps {
  className?: string;
}

export const ChatlogPreview = forwardRef<HTMLDivElement, ChatlogPreviewProps>(
  function ChatlogPreview({ className }, ref) {
    const rawText = useChatlogStore((s) => s.rawText);
    const backgroundColor = useChatlogStore((s) => s.backgroundColor);
    const isTransparent = useChatlogStore((s) => s.isTransparent);
    const setRawText = useChatlogStore((s) => s.setRawText);

    const characterName = useChatlogStore((s) => s.characterName);
    const characterColoringEnabled = useChatlogStore((s) => s.characterColoringEnabled);

    const canvasRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => canvasRef.current as HTMLDivElement, []);

    const lines = useMemo(
      () => parseChat(rawText, { characterName, characterColoringEnabled }),
      [rawText, characterName, characterColoringEnabled]
    );

    return (
      <div className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className ?? ''}`}>
        {/* Canvas Toolbar Header */}
        <EditorToolbar />

        {/* Canvas Area */}
        <div
          className="min-h-[220px] w-full overflow-x-auto p-4 transition-colors"
          style={
            isTransparent
              ? {
                  backgroundImage:
                    'repeating-conic-gradient(rgba(128,128,128,0.18) 0% 25%, rgba(128,128,128,0.28) 0% 50%)',
                  backgroundSize: '16px 16px',
                }
              : undefined
          }
        >
          {lines.length === 0 ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                Paste your in-game chat below to preview and export.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setRawText(SAMPLE_GTA_CHATLOG);
                }}
                className="text-xs font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                Load sample GTA log
              </button>
            </div>
          ) : (
            <div
              ref={canvasRef}
              id="chatlog"
              className="inline-block w-auto min-w-full rounded p-2"
              style={{
                backgroundColor: isTransparent ? 'transparent' : backgroundColor,
              }}
            >
              {lines.map((line, index) => (
                <ChatlogLine key={index} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Canvas Footer: Export Actions (Copy Image / Download PNG) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 bg-muted/30 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {lines.length} {lines.length === 1 ? 'line' : 'lines'}
            </span>
            <span>•</span>
            <span>{isTransparent ? 'Transparent background' : 'Solid background'}</span>
          </div>

          <CanvasExportButtons previewRef={canvasRef} disabled={lines.length === 0} />
        </div>
      </div>
    );
  },
);
