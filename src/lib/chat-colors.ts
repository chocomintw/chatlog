/**
 * Color codes for GTA RP chat log formatting.
 * Includes complete color definitions from Blanco Chatlog Magician
 * and GTA World / FiveM in-game color standards.
 */
export const CHAT_COLORS = {
  // Me / Action Colors
  me: '#c2a3da',
  ame: '#c2a3da',

  // Voice Levels
  darkgrey: '#5a5a5b',    // Lower voice: "says [lower]"
  grey: '#939799',        // Low voice: "says [low]"
  low: '#939799',         // Alias for grey
  lightgrey: '#c6c4c4',   // Secondary / faint voice: "says [low]:"
  white: '#f1f1f1',       // Normal shouts, standard text
  default: '#ffffff',     // In-game default white

  // Status & Alerts
  death: '#f00000',       // Death, gunshot damage, failure, robbery, dropped items
  ckRed: '#f00000',       // Character kill highlight
  ckBlue: '#3896f3',      // Character kill header tag
  yellow: '#fbf724',      // Incoming calls, phone prompts, SMS received, megaphone
  orange: '#eda841',      // Warnings, SMS sent, items placed, info prefixes
  green: '#56d64b',       // Success, money transfers, unlocked doors, weather, Cashtap
  blue: '#3896f3',        // Info, Police MDC, Emergency calls, Panic alarms, Street, Injuries
  infoBlue: '#3896f3',    // Info tag
  infoOrange: '#eda841',  // Info highlight

  // Radios & Transmissions
  radioPrimary: '#ffec8b',    // Primary Radio (CH: 1)
  radioSecondary: '#a19558',  // Secondary Radio (Other channels)
  dep: '#ccca15',             // Department radio: [LSPD -> LSSD]
  depColor: '#ccca15',        // Department radio alias
  vts: '#33c1c9',             // Vessel Traffic Service: [CH: VTS]
  vesseltraffic: '#33c1c9',   // VTS alias
  atc: '#ec3c92',             // Air Traffic Control
  atcController: '#ff9e00',   // ATC Controller

  // Special Dialogue & Directives
  toyou: '#ff00bc',           // Directed at you: [!]
  frenchname: '#ff946c',      // French language speech
  whisper: '#eda841',         // Whispers
  megaphone: '#fbf724',       // Megaphone / microphone
  money: '#56d64b',           // Money transactions
  ooc: '#696969',             // OOC text: (( ... ))
  oocGrey: '#a6acaf',         // GTA World standard OOC grey
  extendedJail: '#26769e',    // Jail custody extension
  sessionHeader: '#7f8c8d',   // Session date / time header [DATE: ... | TIME: ...]
  pm: '#f6ea00',              // Private messages (( PM to/from ... ))
  ads: '#2ecc71',             // Advertisements and news: [Advertisement]
  limeGreen: '#32cd32',       // GTA World action / item lime green
} as const;

export type ChatColorKey = keyof typeof CHAT_COLORS;
