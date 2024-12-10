"use client";

import { deleteNote } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const handleClick = async () => {
    await deleteNote(id);
    redirect("/");
  };

  return <Trash2 onClick={handleClick} color="#ff0000" />;
}
