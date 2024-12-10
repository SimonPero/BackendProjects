"use server";

import { cookies } from "next/headers";
import Link from "next/link";
import { notesApi } from "./api/notes.api";
import Note from "@/components/Note";
import {
  deleteSearchCookie,
  getAuthCookie,
  getLanguageCookie,
  logOutUser,
} from "./actions";
import { NoteDto } from "@/types/dto/note.dto";
import SearchResultsCleaner from "@/components/SearchResultsCleaner";

export default async function Home() {
  let notes: NoteDto[] = [];
  const auth = await getAuthCookie();
  const language = await getLanguageCookie();
  try {
    const cookieStore = cookies();
    const searchResultsCookie = (await cookieStore).get("searchResults");

    if (searchResultsCookie?.value) {
      notes = JSON.parse(searchResultsCookie.value);
    } else {
      notes = await notesApi.getAllNotesOfUser(auth);
    }
  } catch (error) {
    console.error("Failed to fetch notes:", error);

    await logOutUser();
  }

  async function delSearchCookie() {
    "use server";
    await deleteSearchCookie();
  }

  return (
    <section className="flex py-10 sm:py-5 flex-col">
      <SearchResultsCleaner deleteSearchCookie={delSearchCookie} />
      <h1 className="text-4xl underline p-5 flex justify-center">
        {language === "en" ? "Your Notes" : "Tus anotaciones"}
      </h1>
      {auth ? (
        notes.length > 0 ? (
          <div className="mx-auto max-w-7xl px-6 lg:px-8 flex gap-2">
            {notes.map((note) => (
              <Link key={note.id} href={`/note/${note.id}`}>
                <Note
                  title={note.title}
                  createdAt={note.createdAt}
                  updatedAt={note.updatedAt}
                  content={note.content}
                  id={note.id}
                  userId={note.userId}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            {language === "en"
              ? "You haven't wrote any note yet"
              : "No has creado ninguna anotación todavía"}
          </div>
        )
      ) : (
        <div className="flex justify-center">
          {language === "en" ? "Please log in" : "Por favor. Inicia tu sesión"}
        </div>
      )}
    </section>
  );
}
