"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };
  return (
    <div className="flex items-center space-x-2">
      <Switch checked={language === "es"} onCheckedChange={toggleLanguage} />
      <Label>{language === "en" ? "EN" : "ES"}</Label>
    </div>
  );
}
