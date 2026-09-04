import { ChatlogEditor } from '@/components/chatlog-editor';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chatlog Screenshot Editor</h1>
        <ThemeToggle />
      </div>
      <ChatlogEditor />
    </main>
  );
}
