"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface LanguageContextType {
  language: "es" | "en";
  setLanguage: (language: "es" | "en") => void;
}

const defaultLanguageContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextType>(
  defaultLanguageContext
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<"es" | "en">("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("appLanguage");
    if (
      storedLanguage &&
      (storedLanguage === "es" || storedLanguage === "en")
    ) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
