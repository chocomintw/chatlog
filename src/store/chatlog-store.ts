import { create } from 'zustand';

interface ChatlogState {
  rawText: string;
  fontSize: number;
  backgroundColor: string;
  isTransparent: boolean;
  characterName: string;
  savedCharacters: string[];
  characterColoringEnabled: boolean;
  setRawText: (text: string) => void;
  setFontSize: (size: number) => void;
  incrementFontSize: () => void;
  decrementFontSize: () => void;
  resetFontSize: () => void;
  setBackgroundColor: (color: string) => void;
  resetBackgroundColor: () => void;
  toggleTransparent: () => void;
  setCharacterName: (name: string) => void;
  addSavedCharacter: (name: string) => void;
  removeSavedCharacter: (name: string) => void;
  toggleCharacterColoring: () => void;
  initFromStorage: () => void;
}

const DEFAULT_FONT_SIZE = 15;
const DEFAULT_BG_COLOR = '#323131';

export const useChatlogStore = create<ChatlogState>((set) => ({
  rawText: '',
  fontSize: DEFAULT_FONT_SIZE,
  backgroundColor: DEFAULT_BG_COLOR,
  isTransparent: false,
  characterName: '',
  savedCharacters: [],
  characterColoringEnabled: true,
  setRawText: (text) => set({ rawText: text }),
  setFontSize: (size) => set({ fontSize: size }),
  incrementFontSize: () => set((state) => ({ fontSize: state.fontSize + 1 })),
  decrementFontSize: () => set((state) => ({ fontSize: Math.max(11, state.fontSize - 1) })),
  resetFontSize: () => set({ fontSize: DEFAULT_FONT_SIZE }),
  setBackgroundColor: (color) => set({ backgroundColor: color, isTransparent: false }),
  resetBackgroundColor: () => set({ backgroundColor: DEFAULT_BG_COLOR, isTransparent: false }),
  toggleTransparent: () => set((state) => ({ isTransparent: !state.isTransparent })),
  setCharacterName: (name) => {
    set({ characterName: name });
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatlogCharacterName', name);
    }
  },
  addSavedCharacter: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => {
      if (state.savedCharacters.includes(trimmed)) return state;
      const updated = [...state.savedCharacters, trimmed];
      if (typeof window !== 'undefined') {
        localStorage.setItem('characterNameList', JSON.stringify(updated));
      }
      return { savedCharacters: updated };
    });
  },
  removeSavedCharacter: (name) => {
    set((state) => {
      const updated = state.savedCharacters.filter((c) => c !== name);
      if (typeof window !== 'undefined') {
        localStorage.setItem('characterNameList', JSON.stringify(updated));
      }
      return { savedCharacters: updated };
    });
  },
  toggleCharacterColoring: () => {
    set((state) => {
      const next = !state.characterColoringEnabled;
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatlogCharacterColoring', String(next));
      }
      return { characterColoringEnabled: next };
    });
  },
  initFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const savedName = localStorage.getItem('chatlogCharacterName') || '';
      const savedList = JSON.parse(localStorage.getItem('characterNameList') || '[]');
      const savedColoring = localStorage.getItem('chatlogCharacterColoring');
      set({
        characterName: savedName,
        savedCharacters: Array.isArray(savedList) ? savedList : [],
        characterColoringEnabled: savedColoring === null ? true : savedColoring === 'true',
      });
    } catch {
      // ignore JSON parse errors
    }
  },
}));

export { DEFAULT_FONT_SIZE, DEFAULT_BG_COLOR };

