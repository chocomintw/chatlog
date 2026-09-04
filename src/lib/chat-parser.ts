import { CHAT_COLORS } from './chat-colors';

export interface ChatLineRule {
  id: string;
  label: string;
  color: string;
  pattern: RegExp;
  priority: number;
  /** If true, this rule has a custom multi-color render handled by ChatlogLine component */
  multiColor?: boolean;
}

export interface ParsedLine {
  text: string;
  ruleId: string;
  rule: ChatLineRule | null;
  /** Dynamically computed color (e.g. from character name highlight) */
  computedColor?: string;
  /** True if this line belongs to or is directed at the user's character */
  isCharacterLine?: boolean;
}

export interface ParseOptions {
  characterName?: string;
  characterColoringEnabled?: boolean;
}

export interface EmbeddedSpan {
  text: string;
  color: string;
}

export function parseEmbeddedCodes(raw: string): EmbeddedSpan[] {
  const EMBEDDED_RE = /(~[rgbypqocmnws]~)|(!\{\})|(!\{#([0-9a-fA-F]{6})\})/g;
  const result: EmbeddedSpan[] = [];
  let lastIndex = 0;
  const defaultColor = '#FFFFFF';
  let currentColor = defaultColor;
  let m: RegExpExecArray | null;

  while ((m = EMBEDDED_RE.exec(raw)) !== null) {
    if (m.index > lastIndex) {
      const part = raw.slice(lastIndex, m.index);
      if (part) result.push({ text: part, color: currentColor });
    }
    if (m[1]) {
      const letter = m[1].slice(1, -1).toLowerCase();
      switch (letter) {
        case 'r': currentColor = '#FF0000'; break;
        case 'g': currentColor = '#32CD32'; break;
        case 'y': currentColor = '#FFFF00'; break;
        case 'b': currentColor = '#1E90FF'; break;
        case 'p':
        case 'q': currentColor = '#FFC0CB'; break;
        case 'o': currentColor = '#FFA500'; break;
        case 'c':
        case 'm': currentColor = '#999999'; break;
        case 'w': currentColor = '#FFFFFF'; break;
        case 's': currentColor = defaultColor; break;
      }
    } else if (m[2]) {
      currentColor = defaultColor;
    } else if (m[4]) {
      currentColor = '#' + m[4].toUpperCase();
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < raw.length) {
    const rem = raw.slice(lastIndex);
    if (rem) result.push({ text: rem, color: currentColor });
  }
  return result.length ? result : [{ text: raw, color: defaultColor }];
}

const unsortedRules: ChatLineRule[] = [
  // High-priority system & multi-part patterns
  {
    id: 'dateHeader',
    label: 'Session Date',
    color: CHAT_COLORS.sessionHeader,
    pattern: /^\[DATE:\s*(\d{1,2}\/[A-Za-z]{3}\/\d{4})\s*\|\s*TIME:\s*(\d{1,2}:\d{2}:\d{2})\]/i,
    priority: 0,
  },
  {
    id: 'embeddedTags',
    label: 'Embedded Colors',
    color: CHAT_COLORS.default,
    pattern: /(?:~[rgbypqocmnws]~)|(?:!\{\})|(?:!\{#([0-9a-fA-F]{6})\})/,
    priority: 0.5,
    multiColor: true,
  },
  {
    id: 'toyou',
    label: 'Directed at You',
    color: CHAT_COLORS.toyou,
    pattern: /^\[!\]/,
    priority: 1,
    multiColor: true,
  },
  {
    id: 'ck',
    label: 'Character Kill',
    color: CHAT_COLORS.ckRed,
    pattern: /^\[Character kill\]/i,
    priority: 2,
    multiColor: true,
  },
  {
    id: 'attemptSuccess',
    label: 'Attempt Succeeded',
    color: CHAT_COLORS.green,
    pattern: /^\*\s*.+?'s attempt has succeeded\./i,
    priority: 3,
    multiColor: true,
  },
  {
    id: 'attemptFailed',
    label: 'Attempt Failed',
    color: CHAT_COLORS.death,
    pattern: /^\*\s*.+?'s attempt has failed\./i,
    priority: 4,
    multiColor: true,
  },
  {
    id: 'panicAlarm',
    label: 'Panic Alarm',
    color: CHAT_COLORS.blue,
    pattern: /^\[(LSSD|LSPD|PHMC|SADCR|SAHP|NOOSE)\s+PANIC ALARM\]/i,
    priority: 5,
    multiColor: true,
  },
  {
    id: 'emergency',
    label: 'Emergency Call',
    color: CHAT_COLORS.blue,
    pattern: /^\*{5,}\s*EMERGENCY CALL\s*\*{5,}$/i,
    priority: 6,
  },
  {
    id: 'policeMdc',
    label: 'Police MDC',
    color: CHAT_COLORS.blue,
    pattern: /\[POLICE MDC\]/i,
    priority: 7,
  },
  {
    id: 'prisonPa',
    label: 'Prison PA',
    color: CHAT_COLORS.blue,
    pattern: /^\*\*\s*\[PRISON PA\].*\*\*$/i,
    priority: 8,
  },
  {
    id: 'atcController',
    label: 'ATC Controller',
    color: CHAT_COLORS.atcController,
    pattern: /^\*\*\s*\[ch:\s*atc\s*-\s*air\s*traffic\s*controller\]/i,
    priority: 9,
  },
  {
    id: 'atc',
    label: 'ATC',
    color: CHAT_COLORS.atc,
    pattern: /^\*\*\s*\[ch:\s*atc\]/i,
    priority: 10,
  },
  {
    id: 'vts',
    label: 'VTS',
    color: CHAT_COLORS.vts,
    pattern: /^\*\*\s*\[ch:\s*vts/i,
    priority: 11,
  },
  {
    id: 'radioPrimary',
    label: 'Radio Primary',
    color: CHAT_COLORS.radioPrimary,
    pattern: /\[?S:\s*1\s*\|\s*CH:/i,
    priority: 12,
  },
  {
    id: 'radioSecondary',
    label: 'Radio Secondary',
    color: CHAT_COLORS.radioSecondary,
    pattern: /\[?S:\s*[2-9]\d*\s*\|\s*CH:|\|\s*CH:/i,
    priority: 13,
  },
  {
    id: 'dep',
    label: 'Department',
    color: CHAT_COLORS.dep,
    pattern: /\[[^\]]+?\s*->\s*[^\]]+?\]/,
    priority: 14,
  },
  {
    id: 'info',
    label: 'Info',
    color: CHAT_COLORS.infoBlue,
    pattern: /^\[INFO\]/i,
    priority: 15,
    multiColor: true,
  },
  {
    id: 'infoGeneral',
    label: 'System Info',
    color: CHAT_COLORS.orange,
    pattern: /^Info:\s+/i,
    priority: 16,
  },
  {
    id: 'welcome',
    label: 'Welcome',
    color: CHAT_COLORS.white,
    pattern: /^Welcome to\s+GTA World/i,
    priority: 16.1,
    multiColor: true,
  },
  {
    id: 'storePrompt',
    label: 'Store Prompt',
    color: CHAT_COLORS.blue,
    pattern: /^[^:]+:\s*Press\s+[A-Za-z0-9]+\s+to\s+[^.]+\.?$/i,
    priority: 16.2,
    multiColor: true,
  },
  {
    id: 'ticket',
    label: 'Ticket',
    color: CHAT_COLORS.blue,
    pattern: /^\[Ticket\]:\s*\(ticket id:\s*\d+\)/i,
    priority: 17,
    multiColor: true,
  },
  {
    id: 'globalOoc',
    label: 'Global OOC',
    color: CHAT_COLORS.white,
    pattern: /^\(\(\s*Global OOC:\s*/i,
    priority: 17.1,
    multiColor: true,
  },
  {
    id: 'pm',
    label: 'PM',
    color: CHAT_COLORS.pm,
    pattern: /^\(\(\s*PM\s+(?:to|from)\s+/i,
    priority: 17.2,
    multiColor: true,
  },
  {
    id: 'localOoc',
    label: 'Local OOC',
    color: CHAT_COLORS.oocGrey,
    pattern: /^\(\(\s*(?:\(\d+\)\s*)?[^:]+:\s*.*\)\)$/i,
    priority: 17.3,
    multiColor: true,
  },
  {
    id: 'ooc',
    label: 'OOC',
    color: CHAT_COLORS.ooc,
    pattern: /^\(\(/,
    priority: 18,
  },
  {
    id: 'damageShot',
    label: 'Damage Taken',
    color: CHAT_COLORS.death,
    pattern: /^(?:\[\d{2}:\d{2}:\d{2}\]\s+)?You've been shot in (?:the\s+)?.+?\s+with\s+(?:a|an)\s+.+?\s+for\s+\d+\s+damage/i,
    priority: 19,
    multiColor: true,
  },
  {
    id: 'adminPunish',
    label: 'Admin Action',
    color: CHAT_COLORS.death,
    pattern: /^(?:Admin\s+.*\s+(?:banned|jailed|muted|kicked|warned|prisoned|punished)|Server:\s+.*\s+(?:banned|jailed|muted|kicked|warned)|\[ADMIN\]|Your vehicle insurance has expired|\[ERROR\]|You do not have\s+|You cannot\s+|You don't have\s+|.*was\s+(?:kicked|banned|ajailed)\s+for:|You were kicked|Amount should be|Your report has been submitted|Report:\s)/i,
    priority: 19.5,
  },
  {
    id: 'gpsAlert',
    label: 'GPS / Blip Alert',
    color: CHAT_COLORS.yellow,
    pattern: /^(?:Your vehicle insurance expires in|Use F3 to activate|\[WARNING\]|We've placed a blip|A blip has been|A waypoint has been|GPS set to|GPS location|A checkpoint has been|The blip for your vehicle)/i,
    priority: 19.6,
  },
  {
    id: 'serverInfo',
    label: 'Server Info',
    color: CHAT_COLORS.blue,
    pattern: /^(?:Weather forecast:|\[SERVER\]|You can cancel your report|If you (?:fell|need|struggle)|You can also use)/i,
    priority: 19.7,
  },
  {
    id: 'robberyWarning',
    label: 'Robbery Alert',
    color: CHAT_COLORS.death,
    pattern: /^You're being robbed, use \/arob/i,
    priority: 20,
  },
  {
    id: 'droppedItem',
    label: 'Dropped Item',
    color: CHAT_COLORS.death,
    pattern: /^You (?:dropped|lost) |^You took .+ from the property\.$/i,
    priority: 21,
  },
  {
    id: 'unmasked',
    label: 'Unmasked',
    color: CHAT_COLORS.death,
    pattern: /^You are not masked anymore/i,
    priority: 22,
  },
  {
    id: 'weather',
    label: 'Weather',
    color: CHAT_COLORS.green,
    pattern: /^(?:Temperature:\s*[\d.]+°C|Wind:\s*[\d.]+\s*km\/h)/i,
    priority: 23,
  },
  {
    id: 'inventoryHeader',
    label: 'Inventory Header',
    color: CHAT_COLORS.green,
    pattern: /^\|------ .+'s Items \d{2}\/[A-Z]{3}\/\d{4} - \d{2}:\d{2}:\d{2} ------\|/i,
    priority: 24,
  },
  {
    id: 'invTotalWeight',
    label: 'Inventory Weight',
    color: CHAT_COLORS.yellow,
    pattern: /^Total weight:\s*[\d,]+\/[\d,]+\s*grams?/i,
    priority: 24.1,
  },
  {
    id: 'inventoryItem',
    label: 'Inventory Item',
    color: CHAT_COLORS.yellow,
    pattern: /^(?:\[\d{2}:\d{2}:\d{2}\]\s+)?\d+:\s+.+/,
    priority: 25,
  },
  {
    id: 'itemBought',
    label: 'Item Bought',
    color: CHAT_COLORS.white,
    pattern: /^You bought a total of\s+\d+\s+item\(s\)\s+for\s+\$[\d,]+/i,
    priority: 25.1,
    multiColor: true,
  },
  {
    id: 'gasFill',
    label: 'Gas Fill',
    color: CHAT_COLORS.white,
    pattern: /^\[[^\]]+\]:\s*Filled\s+[\d.]+\s+gallons\s+for\s+\$[\d,]+[!.]?$/i,
    priority: 25.2,
    multiColor: true,
  },
  {
    id: 'refill',
    label: 'Refill',
    color: CHAT_COLORS.limeGreen,
    pattern: /^Refilling\s+[\d.]+\s+gallons/i,
    priority: 25.3,
    multiColor: true,
  },
  {
    id: 'shownToYou',
    label: 'Shown To You',
    color: CHAT_COLORS.limeGreen,
    pattern: /^.+?\bhas shown you their\s+/i,
    priority: 25.4,
    multiColor: true,
  },
  {
    id: 'shownByYou',
    label: 'Shown By You',
    color: CHAT_COLORS.blue,
    pattern: /^You have shown\s+.+?\s+your\s+/i,
    priority: 25.5,
    multiColor: true,
  },
  {
    id: 'drugTaken',
    label: 'Drug Taken',
    color: CHAT_COLORS.white,
    pattern: /^You've?\s+just taken\s+/i,
    priority: 25.6,
    multiColor: true,
  },
  {
    id: 'transactionTag',
    label: 'Transaction Tag',
    color: CHAT_COLORS.orange,
    pattern: /^\[(?:Transaction|Cashbox)\]/i,
    priority: 25.7,
    multiColor: true,
  },
  {
    id: 'vehicleSuccess',
    label: 'Vehicle Success',
    color: CHAT_COLORS.limeGreen,
    pattern: /^(?:Your vehicle has been teleported|Vehicle parked\.|You've used\s+|You have successfully\s+|Successfully\s+)/i,
    priority: 25.8,
  },
  {
    id: 'money',
    label: 'Money / Bank',
    color: CHAT_COLORS.green,
    pattern: /(?:paid you \$|you paid \$|You received \$\d+|You have withdrawn \$\d+|You have deposited \$\d+|You collected \$\d+|You added \$\d+|money on hand:)/i,
    priority: 26,
  },
  {
    id: 'give',
    label: 'Give / Receive',
    color: CHAT_COLORS.green,
    pattern: /^You (?:received|gave) /i,
    priority: 27,
  },
  {
    id: 'unlocked',
    label: 'Unlocked',
    color: CHAT_COLORS.green,
    pattern: /^You(?:'ve| have) unlocked (?:the )?.+ to .+/i,
    priority: 28,
  },
  {
    id: 'cashtap',
    label: 'CashTap',
    color: CHAT_COLORS.green,
    pattern: /^\[CASHTAP\]/i,
    priority: 29,
  },
  {
    id: 'masked',
    label: 'Masked',
    color: CHAT_COLORS.green,
    pattern: /^You are now masked/i,
    priority: 30,
  },
  {
    id: 'ads',
    label: 'Advertisement',
    color: CHAT_COLORS.ads,
    pattern: /^\[[^\]]*\b(?:Advertisement|News|Ad)\b[^\]]*\]/i,
    priority: 30.5,
  },
  {
    id: 'smsSent',
    label: 'SMS Sent',
    color: CHAT_COLORS.orange,
    pattern: /^\([^)]+\)\s+Message sent to [^:]+:\s*.+/i,
    priority: 31,
  },
  {
    id: 'smsReceived',
    label: 'SMS Received',
    color: CHAT_COLORS.yellow,
    pattern: /^\([^)]+\)\s+Message from [^:]+:\s*.+/i,
    priority: 32,
  },
  {
    id: 'incomingCall',
    label: 'Incoming Call',
    color: CHAT_COLORS.yellow,
    pattern: /^\([^)]+\)\s+Incoming call from .+/i,
    priority: 33,
  },
  {
    id: 'carWhisper',
    label: 'Car Action',
    color: CHAT_COLORS.yellow,
    pattern: /^\(Car\)/i,
    priority: 34,
  },
  {
    id: 'whisper',
    label: 'Whisper',
    color: CHAT_COLORS.whisper,
    pattern: /(?:whispers(?:\s*\(to\s+[^)]+\))?|szepcze|flüstert|susurra|sussurra|шепчет|chuchote|fısıldıyor):/i,
    priority: 35,
  },
  {
    id: 'megaphone',
    label: 'Megaphone',
    color: CHAT_COLORS.yellow,
    pattern: /(?:\[megaphone\]|\(megafon\)|megafone|megaphon|\[microphone\]):/i,
    priority: 36,
  },
  {
    id: 'saysLower',
    label: 'Says Lower',
    color: CHAT_COLORS.darkgrey,
    pattern: /says\s+\[lower\]/i,
    priority: 37,
  },
  {
    id: 'saysLow',
    label: 'Says Low',
    color: CHAT_COLORS.grey,
    pattern: /says\s+\[low\]/i,
    priority: 38,
  },
  {
    id: 'frenchSpeech',
    label: 'French',
    color: CHAT_COLORS.frenchname,
    pattern: /\[French\]|\b(?:dit|chuchote|crie):\s*/i,
    priority: 39,
  },
  {
    id: 'me',
    label: 'Me / Do / Ame',
    color: CHAT_COLORS.me,
    pattern: /^[*>]/,
    priority: 40,
  },
  {
    id: 'shout',
    label: 'Shout',
    color: CHAT_COLORS.white,
    pattern: /(?:shouts(?:\s*\(to\s+[^)]+\))?|krzyczy|schreit|grita|кричит|crie|bağırıyor):/i,
    priority: 41,
  },
  {
    id: 'street',
    label: 'Street / Location',
    color: CHAT_COLORS.blue,
    pattern: /^\[STREET\]/i,
    priority: 42,
  },
  {
    id: 'injuries',
    label: 'Injuries',
    color: CHAT_COLORS.blue,
    pattern: /^Injuries:/i,
    priority: 43,
  },
  {
    id: 'intercom',
    label: 'Intercom',
    color: CHAT_COLORS.dep,
    pattern: /^\[.*?intercom\]:/i,
    priority: 44,
  },
  {
    id: 'extendedJail',
    label: 'Extended Jail',
    color: CHAT_COLORS.extendedJail,
    pattern: /^You have extended/i,
    priority: 45,
  },
];

export const CHAT_RULES = [...unsortedRules].sort((a, b) => a.priority - b.priority);

const SPEECH_VERB_REGEX = /\b(?:says|shouts|whispers|mówi|krzyczy|szepcze|sagt|schreit|flüstert|dice|grita|susurra|diz|sussurra|говорит|кричит|шепчет|dit|crie|chuchote|diyor|bağırıyor|fısıldıyor)\b/i;

const CHARACTER_COLORABLE_RULES = new Set([
  'default',
  'toyou',
  'shout',
  'whisper',
  'frenchSpeech',
  'saysLower',
  'saysLow',
  'radioPrimary',
  'radioSecondary',
]);

/**
 * Calculates dynamic character-aware coloring for dialogue and radio channels.
 * Matches Blanco Chatlog Magician logic:
 * - Your character's speech: white (#ffffff)
 * - Directed at your character (to ...): white (#ffffff)
 * - Other characters' speech: lightgrey (#c6c4c4)
 * - Your character's radio: primary radio gold (#ffec8b)
 * - Other characters' radio: secondary radio gold (#a19558)
 * - Your character says [lower]: grey (#939799), others: darkgrey (#5a5a5b)
 * - Your character says [low]: lightgrey (#c6c4c4), others: grey (#939799)
 * - Your character phone speech: white (#ffffff), others: yellow (#fbf724)
 * Non-dialogue/non-radio rules (weather, money, actions, alerts, ooc) are NEVER modified.
 */
function computeCharacterColor(
  line: string,
  rule: ChatLineRule | null,
  characterName: string
): { computedColor?: string; isCharacterLine?: boolean } {
  const charName = characterName.trim().toLowerCase();
  if (!charName) return {};

  const ruleId = rule?.id ?? 'default';

  // If this line matched a non-character rule (weather, money, actions, alerts, ooc, etc.),
  // it must retain its rule color and never be modified by character highlighting.
  if (rule && !CHARACTER_COLORABLE_RULES.has(ruleId)) {
    return {};
  }

  const lowerLine = line.toLowerCase();

  // 1. Radio lines: [S: ... | CH: ...]
  if (
    ruleId === 'radioPrimary' ||
    ruleId === 'radioSecondary' ||
    /\[S:\s*\d+\s*\|\s*CH:\s*.+?\]/i.test(line)
  ) {
    const isChar = lowerLine.includes(charName);
    return {
      computedColor: isChar ? CHAT_COLORS.radioPrimary : CHAT_COLORS.radioSecondary,
      isCharacterLine: isChar,
    };
  }

  // 2. says [lower]
  if (lowerLine.includes('says [lower]')) {
    const isChar = lowerLine.includes(charName);
    return {
      computedColor: isChar ? CHAT_COLORS.grey : CHAT_COLORS.darkgrey,
      isCharacterLine: isChar,
    };
  }

  // 3. says [low]: or says [low] (to ...)
  if (lowerLine.includes('says [low]')) {
    if (lowerLine.includes('(phone)')) {
      const isChar = lowerLine.includes(charName);
      return {
        computedColor: isChar ? CHAT_COLORS.white : CHAT_COLORS.yellow,
        isCharacterLine: isChar,
      };
    }
    const saysIndex = lowerLine.indexOf('says');
    const speakerPart = saysIndex !== -1 ? lowerLine.substring(0, saysIndex) : lowerLine;
    const isChar = speakerPart.includes(charName);
    return {
      computedColor: isChar ? CHAT_COLORS.lightgrey : CHAT_COLORS.grey,
      isCharacterLine: isChar,
    };
  }

  // 4. Phone speech: says (phone):
  if (lowerLine.includes('says (phone):') || lowerLine.includes('says [low] (phone):')) {
    const isChar = lowerLine.includes(charName);
    return {
      computedColor: isChar ? CHAT_COLORS.white : CHAT_COLORS.yellow,
      isCharacterLine: isChar,
    };
  }

  // 5. Regular speech, shouts, whispers, foreign speech, [!] directed speech
  const isSpeechLine =
    ruleId === 'toyou' ||
    ruleId === 'shout' ||
    ruleId === 'whisper' ||
    ruleId === 'frenchSpeech' ||
    SPEECH_VERB_REGEX.test(lowerLine);

  if (isSpeechLine) {
    // Strip timestamp and [!] prefix to isolate speaker and addressee
    const clean = line
      .replace(/^\[\d{2}:\d{2}:\d{2}\]\s+/, '')
      .replace(/^\[!\]\s*/, '')
      .trim();

    // Check "(to Addressee)"
    const toMatch = clean.match(/\(to\s+([^)]+)\)/i);
    const targetName = toMatch ? toMatch[1].trim().toLowerCase() : '';

    // Extract speaker before speech verb
    const speakerMatch = clean.match(
      /^([^:]+?)\s+(?:says|shouts|whispers|mówi|krzyczy|szepcze|sagt|schreit|flüstert|dice|grita|susurra|diz|sussurra|говорит|кричит|шепчет|dit|crie|chuchote|diyor|bağırıyor|fısıldıyor)/i
    );
    const speakerName = speakerMatch ? speakerMatch[1].trim().toLowerCase() : '';

    if (targetName === charName || targetName.includes(charName)) {
      return {
        computedColor: CHAT_COLORS.white,
        isCharacterLine: true,
      };
    }

    if (speakerName === charName || speakerName.includes(charName)) {
      return {
        computedColor: CHAT_COLORS.white,
        isCharacterLine: true,
      };
    }

    // Speech from someone else is dimmed to lightgrey
    return {
      computedColor: CHAT_COLORS.lightgrey,
      isCharacterLine: false,
    };
  }

  return {};
}

export function parseLine(line: string, options?: ParseOptions): ParsedLine {
  let matchedRule: ChatLineRule | null = null;
  let ruleId = 'default';

  for (const rule of CHAT_RULES) {
    if (rule.pattern.test(line)) {
      matchedRule = rule;
      ruleId = rule.id;
      break;
    }
  }

  if (options?.characterColoringEnabled !== false && options?.characterName?.trim()) {
    const { computedColor, isCharacterLine } = computeCharacterColor(
      line,
      matchedRule,
      options.characterName
    );
    return {
      text: line,
      ruleId,
      rule: matchedRule,
      computedColor,
      isCharacterLine,
    };
  }

  return { text: line, ruleId, rule: matchedRule };
}

export function parseChat(text: string, options?: ParseOptions): ParsedLine[] {
  if (!text) return [];
  return text.split('\n').map((l) => parseLine(l, options));
}

