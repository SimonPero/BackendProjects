"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function LanguageSelector() {
  const [language, setLanguage] = useState("en");

  function languageChange() {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={language === "es"} onCheckedChange={languageChange} />
      <Label>{language === "en" ? "EN" : "ES"}</Label>
    </div>
  );
}
