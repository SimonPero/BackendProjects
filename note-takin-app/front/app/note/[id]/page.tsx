import { NoteDto } from "@/types/dto/note.dto";
import { notesApi } from "@/app/api/notes.api";
import NoteClient from "@/components/NoteAlone";
const noteDto: NoteDto = {
  id: "",
  title: "",
  createdAt: "",
  updatedAt: "",
  content: "",
  userId: 0,
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const fetchedNote = await notesApi.getNoteById(id);
  return <NoteClient note={fetchedNote} />;
}
