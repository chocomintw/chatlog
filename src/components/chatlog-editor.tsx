'use client';

import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatlogPreview } from './chatlog-preview';
import { ChatlogInput } from './chatlog-input';
import { EditorToolbar } from './editor-toolbar';

export function ChatlogEditor() {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatlogPreview ref={previewRef} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditorToolbar previewRef={previewRef} />
          <ChatlogInput />
        </CardContent>
      </Card>
    </div>
  );
}
