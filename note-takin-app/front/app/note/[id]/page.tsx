import ReactMarkdown from "react-markdown";
import { notesApi } from "@/api/notes.api";
import { NoteDto } from "@/types/dto/note.dto";
import DeleteButton from "@/components/DeleteButton";
import GrammarCheckButton from "@/components/GrammarCheckButton";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const note: NoteDto = await notesApi.getNoteById(id);
  const corrections = await notesApi.checkGrammarNote(
    { text: note.content, language: "en" },
    note.id
  );
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
          <GrammarCheckButton />
        </div>
      </div>
    </article>
  );
}
