import Link from "next/link";
import { notesApi } from "../api/notes.api";
import Note from "@/components/Note";
import { getAuthCookie } from "./action";

type NoteType = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: string;
};

export default async function Home() {
  const notes: NoteType[] = await notesApi.getAllNotes();
  const auth = await getAuthCookie();

  return (
    <section className="bg-white flex py-10 sm:py-5 flex-col">
      <h1 className="text-4xl underline p-5">Your notes</h1>
      {auth ? (
        notes.length > 0 ? (
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
