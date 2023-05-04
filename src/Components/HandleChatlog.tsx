import { useState } from 'react';
import domtoimage from 'dom-to-image';
import fileDownload from "js-file-download";

export default function HandleChatlog() {
  const [chatlog, setChatlog] = useState('');

  function stateChatlog(chatlog: string): void {
    return setChatlog(chatlog);
  }

  function handleSaveClick() {
    const node = document.getElementById("chatlog") as HTMLElement;
    domtoimage.toBlob(node).then(function(blob) {
      fileDownload(blob, new Date().toLocaleString().replaceAll(",", "_").replaceAll(" ", "_")
                                   .replaceAll("/", "-").replace("__", "_").replaceAll(":", "-") + "_" + "chatlog.png");
    });
  }

  // breaks for any new line and colorizes the chat
  function formatChatlog(chatlog: string) {
    // string return after new line inside a map
    return chatlog.split('\n').map((str) => {
      // switch case where if char "*" = true, we colorize
      switch (str) {
        // radio (primary slot)
        case str.toUpperCase().includes('S: 1 | CH:') ? str : '':
          return <div className="outputChatlog radioPrimary">{str}</div>;

        // radio (secondary slot)
        case str.toUpperCase().includes('| CH:') ? str : '':
          return <div className="outputChatlog radioSecondary">{str}</div>;

        case str.startsWith('((') ? str : '':
          return <div className="outputChatlog ooc">{str}</div>;

        // /me
        case str.startsWith('*') || str.startsWith('>') ? str : '':
          return <div className="outputChatlog me">{str}</div>;

        // [low]
        case str.toLowerCase().includes('says [low]:') ? str : '':
          return <div className="outputChatlog low">{str}</div>;

        // whispers
        case str.toLowerCase().includes('whispers:') ? str : '':
          return <div className="outputChatlog whisper">{str}</div>;

        // atc radio
        case str.toUpperCase().startsWith('[CH: ATC]') ? str : '':
          return <div className="outputChatlog atc">{str}</div>;

        // atc controller
        case str.toUpperCase().startsWith('[CH: ATC - AIR TRAFFIC CONTROLLER]')
          ? str
          : '':
          return <div className="outputChatlog atcController">{str}</div>;

        // vts
        case str.toUpperCase().startsWith('[CH: VTS') ? str : '':
          return <div className="outputChatlog vts">{str}</div>;

        // dep
        case str.includes('->') ? str : '':
          return <div className="outputChatlog dep">{str}</div>;

        // money
        case str.toLowerCase().includes('paid you $') ||
        str.toLowerCase().includes('you paid $')
          ? str
          : '':
          return <div className="outputChatlog money">{str}</div>;

        // give/receive
        case str.startsWith('You received') || str.startsWith('You gave')
          ? str
          : '':
          return <div className="outputChatlog give">{str}</div>;

        // default message in chat
        default:
          return <div className="outputChatlog">{str}</div>;
      }
    });
  }

  return (
    <div>
      <textarea
        value={chatlog}
        onChange={(e) => stateChatlog(e.target.value)}
      />
      <div id="chatlog">{formatChatlog(chatlog)}</div>

      <button onClick={handleSaveClick}>Download Image</button>
    </div>
  );
}