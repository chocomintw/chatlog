'use client';

import { memo } from 'react';
import { parseEmbeddedCodes, type ParsedLine } from '@/lib/chat-parser';
import { CHAT_COLORS } from '@/lib/chat-colors';
import { useChatlogStore } from '@/store/chatlog-store';

interface ChatlogLineProps {
  line: ParsedLine;
}

export const ChatlogLine = memo(function ChatlogLine({ line }: ChatlogLineProps) {
  const fontSize = useChatlogStore((s) => s.fontSize);
  const style = { fontSize: `${fontSize}px` };

  // 1. Directed at You: "[!]" in pink, rest in computed character color (white/lightgrey)
  if (line.ruleId === 'toyou') {
    const restColor = line.computedColor ?? CHAT_COLORS.default;
    return (
      <div className="chatlog-line" style={style}>
        <span style={{ color: CHAT_COLORS.toyou }}>{'[!]'}</span>
        <span style={{ color: restColor }}>{line.text.slice(3)}</span>
      </div>
    );
  }

  // 2. Character Kill: "[Character kill] " in blue, rest in death red
  if (line.ruleId === 'ck') {
    return (
      <div className="chatlog-line" style={style}>
        <span style={{ color: CHAT_COLORS.ckBlue }}>{'[Character kill] '}</span>
        <span style={{ color: CHAT_COLORS.ckRed }}>{line.text.slice(17)}</span>
      </div>
    );
  }

  // 3. Attempt Succeeded: "* Name's attempt has " in me, "succeeded. " in green, "((%))" in white
  if (line.ruleId === 'attemptSuccess') {
    const match = line.text.match(/^(\* .+?'s attempt has )(succeeded\. )(\(\(\d+%\)\))$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.me }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.green }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 4. Attempt Failed: "* Name's attempt has " in me, "failed. " in death red, "((%))" in white
  if (line.ruleId === 'attemptFailed') {
    const match = line.text.match(/^(\* .+?'s attempt has )(failed\. )(\(\(\d+%\)\))$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.me }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.death }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 5. Panic Alarm: "[LSPD PANIC ALARM]" in blue, " Name activated their panic alarm at" in white, " Location" in blue
  if (line.ruleId === 'panicAlarm') {
    const match = line.text.match(/^(\[(?:LSSD|LSPD|PHMC|SADCR|SAHP|NOOSE)\s+PANIC ALARM\])( .+ activated their panic alarm at )(.+)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.blue }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.blue }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 6. Info: "[INFO]" in blue, date or first keyword in orange, rest in white
  if (line.ruleId === 'info') {
    const match = line.text.match(/^(\[INFO\]:?)\s*(\[\d{2}\/[A-Z]{3}\/\d{4}\]|\S+)?(.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.infoBlue }}>{match[1]} </span>
          {match[2] && <span style={{ color: CHAT_COLORS.infoOrange }}>{match[2]}</span>}
          {match[3] && <span style={{ color: CHAT_COLORS.default }}>{match[3]}</span>}
        </div>
      );
    }
  }

  // 7. Ticket: "[Ticket]: " in white, "(ticket id: ...)" in blue, rest in white
  if (line.ruleId === 'ticket') {
    const match = line.text.match(/^(\[Ticket\]:\s*)(\(ticket id:\s*\d+\))(.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.white }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.blue }}>{match[2]}</span>
          {match[3] && <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>}
        </div>
      );
    }
  }

  // 8. Damage Shot: "You've been " (white), "shot" (red), " in [the] " (white), bodyPart (red), " with a/an " (white), weapon (red), " for " (white), damage (red), " damage..." (white)
  if (line.ruleId === 'damageShot') {
    const match = line.text.match(
      /^(\[\d{2}:\d{2}:\d{2}\]\s+)?(You've been )(shot)( in (?:the )?)(.+?)( with (?:a|an) )(.+?)( for )(\d+)( damage.*)$/i
    );
    if (match) {
      const [, timestamp, prefix, shotWord, inWord, bodyPart, withWord, weapon, forWord, damageAmount, suffix] = match;
      return (
        <div className="chatlog-line" style={style}>
          {timestamp && <span style={{ color: CHAT_COLORS.grey }}>{timestamp}</span>}
          <span style={{ color: CHAT_COLORS.white }}>{prefix}</span>
          <span style={{ color: CHAT_COLORS.death }}>{shotWord}</span>
          <span style={{ color: CHAT_COLORS.white }}>{inWord}</span>
          <span style={{ color: CHAT_COLORS.death }}>{bodyPart}</span>
          <span style={{ color: CHAT_COLORS.white }}>{withWord}</span>
          <span style={{ color: CHAT_COLORS.death }}>{weapon}</span>
          <span style={{ color: CHAT_COLORS.white }}>{forWord}</span>
          <span style={{ color: CHAT_COLORS.death }}>{damageAmount}</span>
          <span style={{ color: CHAT_COLORS.white }}>{suffix}</span>
        </div>
      );
    }
  }

  // 9. Embedded in-game colors (!{#HEX} or ~r~ tags)
  if (line.ruleId === 'embeddedTags' || /(?:~[rgbypqocmnws]~)|(?:!\{\})|(?:!\{#([0-9a-fA-F]{6})\})/.test(line.text)) {
    const spans = parseEmbeddedCodes(line.text);
    return (
      <div className="chatlog-line" style={style}>
        {spans.map((s, i) => (
          <span key={i} style={{ color: s.color }}>{s.text}</span>
        ))}
      </div>
    );
  }

  // 10. Global OOC: "(( Global OOC: " (white), Player_Name (red), ": message ))" (white)
  if (line.ruleId === 'globalOoc') {
    const match = line.text.match(/^(\(\(\s*Global OOC:\s*(?:\(\d+\)\s*)?)([^:]+)(:.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.white }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.death }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 11. PM: "(( PM to/from ... " (yellow), Player_Name (red), ": message ))" (yellow)
  if (line.ruleId === 'pm') {
    const match = line.text.match(/^(\(\(\s*PM\s+(?:to|from)\s+(?:\(\d+\)\s*)?)([^:]+?)(:.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.pm }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.death }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.pm }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 12. Local OOC: "(( (id) " (grey), Player_Name (lime green), ": message ))" (grey)
  if (line.ruleId === 'localOoc') {
    const match = line.text.match(/^(\(\(\s*(?:\(\d+\)\s*)?)([^:]+)(:.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.oocGrey }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.oocGrey }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 13. Welcome: "Welcome to " (white), "GTA World" (yellow), suffix (white)
  if (line.ruleId === 'welcome') {
    const match = line.text.match(/^(Welcome to\s+)(GTA World)(\.?.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.white }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.yellow }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 14. Store Prompt: "Store: " (blue), "Press Y to ..." (yellow)
  if (line.ruleId === 'storePrompt') {
    const match = line.text.match(/^([^:]+:\s*)(Press\s+[A-Za-z0-9]+\s+to\s+[^.]+\.?)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.blue }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.yellow }}>{match[2]}</span>
        </div>
      );
    }
  }

  // 15. Item Bought: "You bought a total of " (white), count (blue), " item(s) for " (white), $price (lime green)
  if (line.ruleId === 'itemBought') {
    const match = line.text.match(/^(You bought a total of\s*)(\d+)(\s*item\(s\)\s*for\s*)(\$[\d,]+)(\.?)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.white }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.blue }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[4]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[5]}</span>
        </div>
      );
    }
  }

  // 16. Gas Fill: prefix (white), $price (lime green)
  if (line.ruleId === 'gasFill') {
    const match = line.text.match(/^(\[[^\]]+\]:\s*Filled\s+[\d.]+\s+gallons\s+for\s+)(\$[\d,]+[!.]?)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.white }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[2]}</span>
        </div>
      );
    }
  }

  // 17. Refilling Gallons: "Refilling " (lime green), amount (white), " gallons..." (lime green)
  if (line.ruleId === 'refill') {
    const match = line.text.match(/^(Refilling\s+)([\d.]+)(\s+gallons.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 18. Shown to you: prefix (lime green), item (white), suffix (lime green)
  if (line.ruleId === 'shownToYou') {
    const match = line.text.match(/^(.+?\bhas shown you their\s+"?)([^".]*?)("?\.?\s*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 19. Shown by you: prefix (blue), item (white), suffix (blue)
  if (line.ruleId === 'shownByYou') {
    const match = line.text.match(/^(You have shown\s+.+?\s+your\s+"?)([^".]*?)("?\.?\s*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.blue }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.blue }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 20. Drug Taken: "You've just taken " (white), drug (lime green), suffix (white)
  if (line.ruleId === 'drugTaken') {
    const match = line.text.match(/^(You've?\s+just taken\s+"?)([^"!]*?)("?!.*)$/i);
    if (match) {
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.white }}>{match[1]}</span>
          <span style={{ color: CHAT_COLORS.limeGreen }}>{match[2]}</span>
          <span style={{ color: CHAT_COLORS.white }}>{match[3]}</span>
        </div>
      );
    }
  }

  // 21. Transaction / Cashbox: "[Transaction]" (orange), rest in white with money amounts in lime green
  if (line.ruleId === 'transactionTag') {
    const match = line.text.match(/^(\[(?:Transaction|Cashbox)\])(.*)$/i);
    if (match) {
      const tag = match[1];
      const rest = match[2];
      const parts = rest.split(/(\$[\d,]+(?:\.\d{1,2})?)/g);
      return (
        <div className="chatlog-line" style={style}>
          <span style={{ color: CHAT_COLORS.orange }}>{tag}</span>
          {parts.map((p, i) => (
            <span
              key={i}
              style={{
                color: p.startsWith('$') ? CHAT_COLORS.limeGreen : CHAT_COLORS.white,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      );
    }
  }

  // Standard line matching rule (respects character-aware computedColor)
  const color = line.computedColor ?? line.rule?.color ?? CHAT_COLORS.default;

  return (
    <div className="chatlog-line" style={{ ...style, color }}>
      {line.text}
    </div>
  );
});
