"use client";

import { SquarePen } from "lucide-react";
import { grammarCheckNote } from "@/app/action";

export default function GrammarCheckButton({
  userId,
  text,
  language,
  onGrammarCheck,
}: {
  userId: number;
  text: string;
  language: string;
  onGrammarCheck: (
    results: { original: string; suggestions: string[] }[]
  ) => void;
}) {
  async function handleCheck() {
    const results = await grammarCheckNote(userId, text, language);
    onGrammarCheck(results);
  }

  return (
    <div
      onClick={() => {
        handleCheck();
      }}
    >
      <SquarePen />
    </div>
  );
}
