'use client';

import { ChatlogPreview } from './chatlog-preview';
import { ChatlogInput } from './chatlog-input';

export function ChatlogEditor() {
  return (
    <div className="space-y-4">
      {/* Live Preview Canvas Card with attached Canvas Toolbar & Detected Types */}
      <section aria-label="Screenshot preview">
        <ChatlogPreview />
      </section>

      {/* Chatlog Source Card with attached Character Bar, Actions, and Textarea */}
      <section aria-label="Chatlog text input">
        <ChatlogInput />
      </section>
    </div>
  );
}
