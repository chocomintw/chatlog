export const CHAT_COLORS = {
  me: '#c2a2da',
  low: '#bbb',
  whisper: '#eda841',
  atc: '#ec3c92',
  atcController: '#ff9e00',
  vts: '#14becd',
  radioPrimary: '#ffec8b',
  radioSecondary: '#b0a360',
  dep: '#e3e117',
  money: '#32cd32',
  give: '#56d64b',
  ooc: '#696969',
  ckBlue: '#1e90ff',
  ckRed: '#ff0000',
  infoBlue: '#1a7fe1',
  infoOrange: '#f47a00',
  extendedJail: '#26769e',
  megaphone: '#ebd835',
  default: '#ffffff',
} as const;

export type ChatColorKey = keyof typeof CHAT_COLORS;
