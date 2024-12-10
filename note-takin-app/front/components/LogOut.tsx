"use client";

import { logOutUser } from "@/app/actions";
import { useLanguage } from "@/contexts/LanguageContext";
import { redirect } from "next/navigation";

export default function LogOut() {
  const { language } = useLanguage();

  async function CloseSession() {
    await logOutUser();
    redirect("/user/login");
  }

  return (
    <button className="mr-3" onClick={CloseSession}>
      {language === "en" ? "Log out" : "Cerrar sesión"}
    </button>
  );
}
