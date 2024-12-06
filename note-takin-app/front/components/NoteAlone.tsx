"use client";

import { NoteDto } from "@/types/dto/note.dto";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import GrammarCheckButton from "./GrammarCheckButton";
import ReactMarkdown from "react-markdown";

export default function NoteClient({ note }: { note: NoteDto }) {
  const [content, setContent] = useState("");

  function applyGrammarSuggestions(
    results: { original: string; suggestions: string[] }[]
  ) {
    let updatedContent = note.content;
    results.forEach(({ original, suggestions }) => {
      const replacement = suggestions[0];
      const regex = new RegExp(`\\b${original}\\b`, "gi");

      updatedContent = updatedContent.replace(regex, replacement);
    });
    setContent(updatedContent);
  }

  return (
    <article
      key={note.id}
      className="w-full max-w-2xl mx-auto bg-gray-50 shadow-lg rounded-lg p-6 mt-10 text-black flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-start text-gray-800">
        {note.title}
      </h2>

      <small className="text-sm text-start">
        Created on: {new Date(note.createdAt).toLocaleDateString()}
      </small>

      <ReactMarkdown className="prose prose-lg max-w-none text-gray-700 p-2">
        {note.content}
      </ReactMarkdown>

      <div className="flex justify-end">
        <div className="rounded p-1 border border-transparent cursor-pointer hover:border-red-900 transition duration-200 max-w-fit">
          <DeleteButton id={note.id} />
        </div>
        <div className="rounded p-1 border border-transparent cursor-pointer hover:border-red-900 transition duration-200 max-w-fit">
          <GrammarCheckButton
            userId={note.userId}
            text={note.content}
            language={"en"}
            onGrammarCheck={applyGrammarSuggestions}
          />
        </div>
      </div>
    </article>
  );
}
