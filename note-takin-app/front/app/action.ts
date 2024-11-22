"use server";

import { authApi } from "@/api/auth.api";
import { notesApi } from "@/api/notes.api";
import { usersApi } from "@/api/users.api";
import { AuthDto } from "@/types/dto/auth.dto";
import { CreateNoteDto, NoteDto } from "@/types/dto/note.dto";
import { CreateUserDto, UserDto } from "@/types/dto/user.dto";
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
  const cookieStore = cookies();
  const auth = (await cookieStore).get("auth");
  return auth;
}

export async function deleteNote(id: string) {
  const data = await notesApi.deleteNote(id);
  return data;
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
