import {useState} from 'react';

export default function App() {
  const [chatlog, setChatlog] = useState('');

  function handleChatlog(chatlog: string): void {
    return setChatlog(chatlog);
  }

  function formatChatlog(chatlog: string) {
    return chatlog.split('\n').map(str => {
      switch (str) {
        case str.startsWith('*') ? str : '':
          return <div className="outputChatlog me">{str}</div>;

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
