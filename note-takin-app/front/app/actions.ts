"use server";

import { authApi } from "./api/auth.api";
import { notesApi } from "./api/notes.api";
import { usersApi } from "./api/users.api";
import { AuthDto } from "@/types/dto/auth.dto";
import { NoteDto, SpellCheckResult, putNoteData } from "@/types/dto/note.dto";
import { CreateUserDto, UserDto } from "@/types/dto/user.dto";
import Fuse from "fuse.js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(user: CreateUserDto) {
  try {
    const data: UserDto = await usersApi.createUser(user);
    return data;
  } catch (error) {
    return error;
  }
}

export async function loginUser(email: string, password: string) {
  const data: AuthDto = await authApi.logIn(email, password);
  return data;
}

export async function logOutUser() {
  const data = await authApi.logOut();
  return data;
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");
  return auth;
}

export async function deleteNote(id: string) {
  await notesApi.deleteNote(id);
}

export async function createNote({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const auth = (await cookies()).get("auth");
  if (!auth) {
    redirect("/");
  }
  const id = parseInt(auth.value.split(".")[0]);
  const data: NoteDto = await notesApi.createNote({
    title,
    content,
    userId: id,
  });
  redirect(`/note/${data.id}`);
}

export async function searchNotes(notes: NoteDto[], searchQuery: string) {
  if (searchQuery.trim() !== "") {
    const fuse = new Fuse(notes, {
      keys: ["title", "content"],
      threshold: 0.3,
    });
    const results = fuse.search(searchQuery).map((result) => result.item);

    const cookieStore = await cookies();

    cookieStore.set("searchResults", JSON.stringify(results), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });
  }
  redirect("/");
}

export async function deleteSearchCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("searchResults");
}
export async function getLanguageCookie(): Promise<"es" | "en"> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("appLanguage");
  const lang: "es" | "en" = langCookie?.value === "es" ? "es" : "en";
  return lang;
}
export async function setLanguageCookie(lang: "es" | "en"): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("appLanguage", lang);
}

export async function grammarCheckNote(
  userId: number,
  text: string,
  language: string
) {
  const corrections: SpellCheckResult[] = await notesApi.checkGrammarNote(
    { text, language },
    userId
  );

  return corrections;
}
export async function saveNoteChanges(toChange: putNoteData, noteId: string) {
  return await notesApi.updateNote(toChange, noteId);
}
export async function getNoteById(id: string) {
  const note: NoteDto = await notesApi.getNoteById(id);
  return note;
}
