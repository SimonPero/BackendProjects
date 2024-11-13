import { NoteDto } from "@/types/dto/note.dto";

class NotesApi {
  async getAllNotes(): Promise<NoteDto[]> {
    const res = await fetch(`${process.env.API_URL}/notes`);
    const data = await res.json();
    return data;
  }
  async getNoteById(id: string): Promise<NoteDto> {
    const res = await fetch(`${process.env.API_URL}/notes/${id}`);
    const data = await res.json();
    return data;
  }
}

export const notesApi = new NotesApi();
