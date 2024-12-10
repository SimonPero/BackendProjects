"use client";

import { NoteDto } from "@/types/dto/note.dto";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import GrammarCheckButton from "./GrammarCheckButton";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { SaveAll } from "lucide-react";
import { saveNoteChanges } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export default function NoteClient({ note }: { note: NoteDto }) {
  const [content, setContent] = useState(note.content);
  const [toHide, setHidden] = useState(true);
  const { language } = useLanguage();
  const { toast } = useToast();

  function applyGrammarSuggestions(
    results: { original: string; suggestions: string[] }[]
  ) {
    let updatedContent = content;
    results.forEach(({ original, suggestions }) => {
      const replacement = suggestions[0];
      const regex = new RegExp(`\\b${original}\\b`, "gi");

      updatedContent = updatedContent.replace(regex, replacement);
    });
    setContent(updatedContent);
    setHidden(false);
  }

  async function handleNoteChanges() {
    await saveNoteChanges({ content }, note.id);
    setHidden(true);
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
        {content}
      </ReactMarkdown>
      <div className="flex justify-between items-center max-w-full">
        <div
          className={`transition-all duration-300 ease-in-out ${
            toHide ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          }`}
        >
          <div
            onClick={async () => {
              console.log("Save button clicked");
              try {
                await handleNoteChanges();
                console.log("Changes saved successfully");
                toast({
                  description:
                    language === "en"
                      ? "Changes have been saved"
                      : "Los cambios han sido guardados",
                });
              } catch (error) {
                console.error("Failed to save changes", error);
                toast({
                  description:
                    language === "en"
                      ? "Failed to save changes"
                      : "Error al guardar los cambios",
                  variant: "destructive",
                });
              }
            }}
            className="rounded p-1 border border-transparent cursor-pointer hover:border-black transition duration-200 max-w-fit"
          >
            <SaveAll />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="rounded p-1 border border-transparent cursor-pointer hover:border-red-900 transition duration-200 max-w-fit">
            <DeleteButton id={note.id} />
          </div>
          <div className="rounded p-1 border border-transparent cursor-pointer hover:border-red-900 transition duration-200 max-w-fit">
            <GrammarCheckButton
              userId={note.userId}
              text={content}
              language={language}
              onGrammarCheck={applyGrammarSuggestions}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
