"use client";

import { deleteNote } from "@/app/action";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id }: { id: string }) {
  const handleClick = () => {
    deleteNote(id);
  };

  return (
    <Trash2
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-700 cursor-pointer"
    />
  );
}
