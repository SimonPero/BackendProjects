"use client";
import { getLanguageCookie, setLanguageCookie } from "@/app/actions";
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
    const fetchInitialLanguage = async () => {
      try {
        const storedLanguage = await getLanguageCookie();
        if (storedLanguage && ["es", "en"].includes(storedLanguage)) {
          setLanguage(storedLanguage);
          await setLanguageCookie(storedLanguage);
        }
      } catch (error) {
        console.error("Failed to fetch or set language:", error);
      }
    };

    fetchInitialLanguage();
  }, []); // Empty dependency array means this runs only on component mount

  const updateLanguage = async (newLanguage: "es" | "en") => {
    try {
      await setLanguageCookie(newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: updateLanguage 
      }}
    >
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