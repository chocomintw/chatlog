import {useState} from 'react';

export default function App() {
  const [chatlog, setChatlog] = useState('');

  function handleChatlog(chatlog: string): void {
    return setChatlog(chatlog);
  }

  // breaks for any new line and colorizes the chat
  function formatChatlog(chatlog: string) {
    // string return after new line inside a map
    return chatlog.split('\n').map(str => {
      // switch case where if char = true we colorize
      switch (str) {
        // /me
        case str.startsWith('*') ? str : '':
          return <div className="outputChatlog me">{str}</div>;

        // default message in chat
        default:
          return <div className="outputChatlog">{str}</div>;
      }
    });
  }

  return (
    <>
      <textarea value={chatlog} onChange={e => handleChatlog(e.target.value)} />
      {formatChatlog(chatlog)}
    </>
  );
}
