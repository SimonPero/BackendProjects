import { cookies } from "next/headers";
import Link from "next/link";
import { notesApi } from "../api/notes.api";
import Note from "@/components/Note";
import { getAuthCookie } from "./action";
import { NoteDto } from "@/types/dto/note.dto";
import SearchResultsCleaner from "@/components/SearchResultsCleaner";

export default async function Home() {
  const auth = await getAuthCookie();
  const cookieStore = cookies();
  let notes: NoteDto[] = [];
  const searchResultsCookie = (await cookieStore).get("searchResults");

  if (!searchResultsCookie?.value) {
    notes = await notesApi.getAllNotesOfUser();
  } else {
    notes = JSON.parse(searchResultsCookie.value);
  }

  async function deleteSearchCookie() {
    "use server";
    (await cookies()).delete("searchResults");
  }

  return (
    <section className="flex py-10 sm:py-5 flex-col">
      <SearchResultsCleaner deleteSearchCookie={deleteSearchCookie} />
      <h1 className="text-4xl underline p-5 flex justify-center">Your notes</h1>
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
                />
              </Link>
            ))}
          </div>
        ) : (
          <div>There are no notes</div>
        )
      ) : (
        <div>Please Log In</div>
      )}
    </section>
  );
}
