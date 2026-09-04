import { create } from 'zustand';

interface ChatlogState {
  rawText: string;
  fontSize: number;
  backgroundColor: string;
  setRawText: (text: string) => void;
  setFontSize: (size: number) => void;
  incrementFontSize: () => void;
  decrementFontSize: () => void;
  resetFontSize: () => void;
  setBackgroundColor: (color: string) => void;
  resetBackgroundColor: () => void;
}

const DEFAULT_FONT_SIZE = 15;
const DEFAULT_BG_COLOR = '#323131';

export const useChatlogStore = create<ChatlogState>((set) => ({
  rawText: '',
  fontSize: DEFAULT_FONT_SIZE,
  backgroundColor: DEFAULT_BG_COLOR,
  setRawText: (text) => set({ rawText: text }),
  setFontSize: (size) => set({ fontSize: size }),
  incrementFontSize: () => set((state) => ({ fontSize: state.fontSize + 1 })),
  decrementFontSize: () => set((state) => ({ fontSize: Math.max(1, state.fontSize - 1) })),
  resetFontSize: () => set({ fontSize: DEFAULT_FONT_SIZE }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  resetBackgroundColor: () => set({ backgroundColor: DEFAULT_BG_COLOR }),
}));

export { DEFAULT_FONT_SIZE, DEFAULT_BG_COLOR };
