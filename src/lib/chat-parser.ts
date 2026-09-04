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
  ruleId: string;  // which rule matched, or 'default'
  rule: ChatLineRule | null;
}

const unsortedRules: ChatLineRule[] = [
  { id: 'ck', label: 'Character Kill', color: CHAT_COLORS.ckRed, pattern: /^\[Character kill\]/, priority: 3, multiColor: true },
  { id: 'info', label: 'Info', color: CHAT_COLORS.infoBlue, pattern: /^\[INFO\]:\s/, priority: 4, multiColor: true },
  { id: 'ooc', label: 'OOC', color: CHAT_COLORS.ooc, pattern: /^\(\(/, priority: 5 },
  { id: 'vts', label: 'VTS', color: CHAT_COLORS.vts, pattern: /^\*\*\s*\[ch:\s*vts/i, priority: 7 },
  { id: 'atcController', label: 'ATC Controller', color: CHAT_COLORS.atcController, pattern: /^\*\*\s*\[ch:\s*atc\s*-\s*air\s*traffic\s*controller\]/i, priority: 8 },
  { id: 'atc', label: 'ATC', color: CHAT_COLORS.atc, pattern: /^\*\*\s*\[ch:\s*atc\]/i, priority: 9 },
  { id: 'radioPrimary', label: 'Radio Primary', color: CHAT_COLORS.radioPrimary, pattern: /s:\s*1\s*\|\s*ch:/i, priority: 10 },
  { id: 'radioSecondary', label: 'Radio Secondary', color: CHAT_COLORS.radioSecondary, pattern: /\|\s*ch:/i, priority: 20 },
  { id: 'me', label: 'Me/Do', color: CHAT_COLORS.me, pattern: /^[*>]/, priority: 30 },
  { id: 'low', label: 'Low', color: CHAT_COLORS.low, pattern: /says\s*\[low\]/i, priority: 40 },
  { id: 'whisper', label: 'Whisper', color: CHAT_COLORS.whisper, pattern: /whispers:/i, priority: 50 },
  { id: 'dep', label: 'Department', color: CHAT_COLORS.dep, pattern: /->/, priority: 60 },
  { id: 'money', label: 'Money', color: CHAT_COLORS.money, pattern: /(?:paid you \$|you paid \$)/i, priority: 70 },
  { id: 'give', label: 'Give/Receive', color: CHAT_COLORS.give, pattern: /^You (?:received|gave)/, priority: 80 },
  { id: 'extendedJail', label: 'Extended Jail', color: CHAT_COLORS.extendedJail, pattern: /^You have extended/, priority: 85 },
  { id: 'megaphone', label: 'Megaphone', color: CHAT_COLORS.megaphone, pattern: /\[megaphone\]:/i, priority: 90 },
];

export const CHAT_RULES = [...unsortedRules].sort((a, b) => a.priority - b.priority);

export function parseLine(line: string): ParsedLine {
  for (const rule of CHAT_RULES) {
    if (rule.pattern.test(line)) {
      return { text: line, ruleId: rule.id, rule };
    }
  }
  return { text: line, ruleId: 'default', rule: null };
}

export function parseChat(text: string): ParsedLine[] {
  if (!text) return [];
  return text.split('\n').map(parseLine);
}
