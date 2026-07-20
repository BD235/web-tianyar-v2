"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: "Home",
    destinations: "Destinations",
    maps: "Maps",
    admin: "Admin",
    explore: "Explore",
    discover: "Discover & Find",
    beauty: "BEAUTY IN TIANYAR",
  },
  id: {
    home: "Beranda",
    destinations: "Destinasi",
    maps: "Peta",
    admin: "Admin",
    explore: "Jelajahi",
    discover: "Jelajahi & Temukan",
    beauty: "KEINDAHAN DI TIANYAR",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang && (storedLang === "en" || storedLang === "id")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = useCallback((key: string) => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  }, [language]);

  // Render langsung cegah layout shift
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
