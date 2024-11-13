import ReactMarkdown from "react-markdown";
import { notesApi } from "@/api/notes.api";
import { NoteDto } from "@/types/dto/note.dto";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const note: NoteDto = await notesApi.getNoteById(id);
  return (
    <article key={note.id} className="bg-white text-black text-center">
      <h2>{note.title}</h2>
      <small>{new Date(note.createdAt).toLocaleDateString()}</small>
      <ReactMarkdown>{note.content}</ReactMarkdown>
    </article>
  );
}
