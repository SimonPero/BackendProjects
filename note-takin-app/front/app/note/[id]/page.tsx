import { notesApi } from "@/app/api/notes.api";
import NoteClient from "@/components/NoteAlone";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const fetchedNote = await notesApi.getNoteById(id);
  return <NoteClient note={fetchedNote} />;
}
