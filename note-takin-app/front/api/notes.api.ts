import { getAuthCookie } from "@/app/action";
import { CreateNoteDto, NoteDto } from "@/types/dto/note.dto";
import { SpellCheckResult } from "@/types/dto/note.dto";

type CheckNote = {
  text: string;
  language: string;
};

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

    const res = await fetch(`${process.env.API_URL}/notes/user/${userId}`, {
      credentials: "include",
      headers: {
        Cookie: `${auth.name}=${auth.value}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch notes");
    }

    return data;
  }

  async getNoteById(id: string): Promise<NoteDto> {
    const auth = await getAuthCookie();
    if (!auth) {
      throw {};
    }
    const res = await fetch(`${process.env.API_URL}/notes/${id}`, {
      credentials: "include",
      headers: {
        Cookie: `${auth.name}=${auth.value}`,
      },
    });
    const data = await res.json();
    return data;
  }

  async createNote(noteToCreate: CreateNoteDto): Promise<NoteDto> {
    const auth = await getAuthCookie();
    if (!auth) {
      throw {};
    }
    const res = await fetch(`${process.env.API_URL}/notes`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `${auth.name}=${auth.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteToCreate),
    });
    const data = await res.json();
    return data;
  }

  async deleteNote(id: string): Promise<NoteDto> {
    const auth = await getAuthCookie();
    if (!auth) {
      throw {};
    }
    const res = await fetch(`${process.env.API_URL}/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Cookie: `${auth.name}=${auth.value}`,
      },
    });
    const data = await res.json();
    return data;
  }

  async checkGrammarNote(
    toCheck: CheckNote,
    id: number
  ): Promise<SpellCheckResult[]> {
    const auth = await getAuthCookie();
    if (!auth) {
      throw {};
    }
    const res = await fetch(`${process.env.API_URL}/notes/check/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `${auth.name}=${auth.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toCheck),
    });
    const data = await res.json();
    return data;
  }
}

export const notesApi = new NotesApi();
