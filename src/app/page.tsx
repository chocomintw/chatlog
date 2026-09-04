import { ChatlogHeader } from '@/components/chatlog-header';
import { ChatlogEditor } from '@/components/chatlog-editor';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <ChatlogHeader />
        <ChatlogEditor />
      </main>
    </div>
  );
}
