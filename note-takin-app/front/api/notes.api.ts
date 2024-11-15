import { getAuthCookie } from "@/app/action";
import { NoteDto } from "@/types/dto/note.dto";

class NotesApi {
  async getAllNotes(): Promise<NoteDto[]> {
    const res = await fetch(`${process.env.API_URL}/notes`);
    const data = await res.json();
    return data;
  }
  async getAllNotesOfUser(): Promise<NoteDto[]> {
    const auth = await getAuthCookie();
    if (!auth) {
      return [];
    }
    const userId = parseInt(auth.value.split(".")[0]);
    const res = await fetch(`${process.env.API_URL}/notes/user/${userId}`);
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
