import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { DEFAULT_LANGUAGE } from "../utils/i18n";
import type { SupportedLanguage } from "../utils/i18n";
import { translations, getTranslations, type Translations } from "../translations/index";





interface LanguageContextType {
  language: SupportedLanguage;
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Safe localStorage helpers
const getStoredLanguage = (): SupportedLanguage => {
  try {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;

    const stored = localStorage.getItem("cuban-salsa-language");
    if (stored && ["en", "de", "es", "fr", "pl"].includes(stored)) {
      return stored as SupportedLanguage;
    }

    // Fallback to browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("de")) return "de";
    if (browserLang.startsWith("es")) return "es";
    if (browserLang.startsWith("fr")) return "fr";
    if (browserLang.startsWith("pl")) return "pl";

    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn("Failed to get stored language:", error);
    return DEFAULT_LANGUAGE;
  }
};

const setStoredLanguage = (language: SupportedLanguage): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("cuban-salsa-language", language);
    }
  } catch (error) {
    console.warn("Failed to store language:", error);
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  // Memoize translations to ensure they update when language changes
  const t = useMemo(() => getTranslations(language), [language]);

  // Initialize language from storage or browser after mount
  useEffect(() => {
    setMounted(true);
    const initialLanguage = getStoredLanguage();
    setLanguageState(initialLanguage);

    // Update document language attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = initialLanguage;
    }
  }, []);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    setStoredLanguage(newLanguage);

    // Update document language attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLanguage;
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          language: DEFAULT_LANGUAGE,
          currentLanguage: DEFAULT_LANGUAGE,
          setLanguage: () => {},
          t: getTranslations(DEFAULT_LANGUAGE),
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider
      value={{ language, currentLanguage: language, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};