import ReactMarkdown from "react-markdown";
import { notesApi } from "@/api/notes.api";
import { NoteDto } from "@/types/dto/note.dto";
import DeleteButton from "@/components/DeleteButton";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const note: NoteDto = await notesApi.getNoteById(id);

  return (
    <article
      key={note.id}
      className="bg-white text-black flex flex-col items-center"
    >
      <h2>{note.title}</h2>
      <small>{new Date(note.createdAt).toLocaleDateString()}</small>
      <ReactMarkdown>{note.content}</ReactMarkdown>

      <DeleteButton id={note.id} />
    </article>
  );
}
