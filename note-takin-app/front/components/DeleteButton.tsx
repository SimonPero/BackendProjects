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
      color="#ff0000"
    />
  );
}
