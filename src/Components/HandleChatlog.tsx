import { useState } from 'react';
import domtoimage from 'dom-to-image';
import fileDownload from "js-file-download";


export default function HandleChatlog() {
  const [chatlog, setChatlog] = useState('');
  const [fontsize, setFontsize] = useState(15)

  function stateChatlog(chatlog: string): void {
    return setChatlog(chatlog);
  }

  function handleSaveClick(): void {
    const node = document.getElementById("chatlog") as HTMLElement;
    domtoimage.toBlob(node)
              .then(function(blob) {
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

        // ooc
        case str.startsWith('((') ? str : '':
          return <div className="outputChatlog ooc" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // atc radio
        case str.toUpperCase().startsWith('** [CH: ATC]') ? str : '':
          return <div className="outputChatlog atc" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;
        
        // atc controller
        case str.toUpperCase().startsWith('** [CH: ATC - AIR TRAFFIC CONTROLLER]')
          ? str
          : '':
          return <div className="outputChatlog atcController" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;
        
      // vts
        case str.toUpperCase().startsWith('** [CH: VTS') ? str : '':
          return <div className="outputChatlog vts" style={{
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

        // CK
        case str.startsWith('[Character kill]') ? str: '':
          return <>
            <div className='outputChatlog'>
              <span className='ckBlue' style={{fontSize: `${fontsize}px`}}>
                {"[Character kill] "}
              </span>
              <span className='outputChatlog ckRed' style={{fontSize: `${fontsize}px`}}>
                {str.slice(17)}
              </span>
            </div>
          </>

        // marker
        case str.startsWith('[INFO]: ') ? str: '':
          const infoStr = str.split(' ')
          return <>
            <div className='outputChatlog'>
              <span className='infoBlue' style={{fontSize: `${fontsize}px`}}>
                {"[INFO]: "}
              </span>
              <span className='infoOrange' style={{fontSize: `${fontsize}px`}}>
                {`${infoStr[1]} `}
              </span>
              <span style={{fontSize: `${fontsize}px`}}>
                {str.slice(22)}
              </span>
            </div>
          </>

        case str.startsWith('You have extended') ? str : '':
          return <div className="outputChatlog extendedJail" style={{
            fontSize: `${fontsize}px`
            }}>{str}</div>;

        // megaphone
        case str.toLowerCase().includes('[megaphone]:') ? str : '':
          return <div className="outputChatlog megaphone" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;

        // default message in chat
        default:
          return <div className="outputChatlog" style={{
            fontSize: `${fontsize}px`
          }}>{str}</div>;
      }
    });
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className="w-auto inline-block m-0 p-0" id="chatlog">{formatChatlog(chatlog)}</div>
        <textarea
          value={chatlog}
          onChange={(e) => stateChatlog(e.target.value)}
        />
      </div>
      <button className='inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-blue-600 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-blue-700 hover:border-blue-700 hover:text-white focus-within:bg-blue-700 focus-within:border-blue-700' onClick={handleSaveClick}>Download Image</button>

      <button className='inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-blue-600 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-blue-700 hover:border-blue-700 hover:text-white focus-within:bg-blue-700 focus-within:border-blue-700' onClick={() => {setFontsize(fontsize + 1)}}>+</button>
      <button className='inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-blue-600 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-blue-700 hover:border-blue-700 hover:text-white focus-within:bg-blue-700 focus-within:border-blue-700' onClick={() => {setFontsize(fontsize - 1)}}>-</button>
      <button className='inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-blue-600 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-blue-700 hover:border-blue-700 hover:text-white focus-within:bg-blue-700 focus-within:border-blue-700' onClick={() => {setFontsize(15)}}>reset</button>
      {fontsize}px
    </>
    
    
  );
}


/**
 * 
 * <a href="#_" class="inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-blue-600 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-blue-700 hover:border-blue-700 hover:text-white focus-within:bg-blue-700 focus-within:border-blue-700">
Button Text
<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
</a>
 */