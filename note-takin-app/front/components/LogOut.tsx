"use client";

import { logOutUser } from "@/app/action";
import { redirect } from "next/navigation";

export default function LogOut() {
  async function CloseSession() {
    await logOutUser();
    redirect("/user/login");
  }
  return (
    <span
      className="cursor-pointer mr-3"
      onClick={async () => {
        await CloseSession();
      }}
    >
      Cerrar sesión
    </span>
  );
}
