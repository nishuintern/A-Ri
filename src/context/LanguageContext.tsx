"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "fr" | "en" | "hi";

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  toggle: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const toggle = () =>
    setLang((l) => (l === "fr" ? "en" : l === "en" ? "hi" : "fr"));

  return (
    <LanguageContext.Provider value={{ lang, toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
