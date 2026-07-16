import { create } from 'zustand';
import { Language, translations, getTranslation } from '@/lib/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, defaultValue?: string) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',

  setLanguage: (lang: Language) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },

  t: (path: string, defaultValue = '') => {
    const { language } = get();
    return getTranslation(language, path, defaultValue);
  },
}));

// Initialize language from localStorage on client
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('language') as Language | null;
  if (savedLanguage && ['en', 'om', 'am'].includes(savedLanguage)) {
    useLanguageStore.setState({ language: savedLanguage });
  }
}
