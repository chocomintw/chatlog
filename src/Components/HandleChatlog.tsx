import { useState } from 'react';
import domtoimage from 'dom-to-image';
import fileDownload from "js-file-download";

export default function HandleChatlog() {
  const [chatlog, setChatlog] = useState('');
  const [fontsize, setFontsize] = useState(15)

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
          return <div className="outputChatlog radioPrimary" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // radio (secondary slot)
        case str.toUpperCase().includes('| CH:') ? str : '':
          return <div className="outputChatlog radioSecondary" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        case str.startsWith('((') ? str : '':
          return <div className="outputChatlog ooc" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // /me
        case str.startsWith('*') || str.startsWith('>') ? str : '':
          return <div className="outputChatlog me" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // [low]
        case str.toLowerCase().includes('says [low]') ? str : '':
          return <div className="outputChatlog low" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // whispers
        case str.toLowerCase().includes('whispers:') ? str : '':
          return <div className="outputChatlog whisper" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // atc radio
        case str.toUpperCase().startsWith('[CH: ATC]') ? str : '':
          return <div className="outputChatlog atc" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // atc controller
        case str.toUpperCase().startsWith('[CH: ATC - AIR TRAFFIC CONTROLLER]')
          ? str
          : '':
          return <div className="outputChatlog atcController" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // vts
        case str.toUpperCase().startsWith('[CH: VTS') ? str : '':
          return <div className="outputChatlog vts" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // dep
        case str.includes('->') ? str : '':
          return <div className="outputChatlog dep" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // money
        case str.toLowerCase().includes('paid you $') ||
        str.toLowerCase().includes('you paid $')
          ? str
          : '':
          return <div className="outputChatlog money" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // give/receive
        case str.startsWith('You received') || str.startsWith('You gave')
          ? str
          : '':
          return <div className="outputChatlog give" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        case str.startsWith('[Character kill]') ? str: '':
          const newStr = str.split(" ")
          return <>
            <div className='outputChatlog'>
              <span className='ckBlue' style={{
            fontSize: `${fontsize}px`
          }}>{"[Character kill] "}</span>
              <span className='outputChatlog ckRed' style={{
            fontSize: `${fontsize}px`
          }}>{newStr[2]} {newStr[3]} {newStr[4]} {newStr[5]} {newStr[6]}</span>
            </div>
          </>

        // default message in chat
        default:
          return <div className="outputChatlog" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;
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

      <button onClick={() => {setFontsize(fontsize + 1)}}>+</button>
      <button onClick={() => {setFontsize(fontsize - 1)}}>-</button>
      {fontsize}px
    </div>
  );
}