import {useState} from 'react'

export default function App() {
  const [chatlog, setChatlog] = useState('')

  function handleChatlog(chatlog: string) {
    setChatlog(chatlog)
  }

  return (
    <div className="App">
      <textarea value={chatlog} onChange={e => handleChatlog(e.target.value)} />
      {chatlog}
    </div>
  )
}
