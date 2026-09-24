import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  LanguageInfo, 
  translations 
} from '../lib/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultFallback?: string) => string;
  languages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('mindease_lang');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved as SupportedLanguage;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('mindease_lang', newLang);
    } catch {}
  };

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, defaultFallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Check key aliases (e.g. dash. -> dashboard., or dashboard. -> dash.)
    let altKey: string | null = null;
    if (key.startsWith('dash.')) {
      altKey = key.replace('dash.', 'dashboard.');
    } else if (key.startsWith('dashboard.')) {
      altKey = key.replace('dashboard.', 'dash.');
    }

    if (altKey && langDict && langDict[altKey]) {
      return langDict[altKey];
    }

    // Fallback to English
    const enDict = translations.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    if (altKey && enDict && enDict[altKey]) {
      return enDict[altKey];
    }
    return defaultFallback || key;
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe fallback if used outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string, defaultFallback?: string) => defaultFallback || key,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageInfo: SUPPORTED_LANGUAGES[0],
    };
  }
  return context;
};
