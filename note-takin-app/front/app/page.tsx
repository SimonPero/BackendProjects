import Link from "next/link";
import { notesApi } from "../api/notes.api";
import Note from "@/components/Note";

type note = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: string;
};

export default async function Home() {
  const notes: note[] = await notesApi.getAllNotes();

  return (
    <div>
      <h1>Douuu</h1>
      <section>
        {notes.length > 0 ? (
          <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              {notes.map((note) => (
                <Link href={`/note/${note.id}`}>
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
          </div>
        ) : (
          <div>There are no notes</div>
        )}
      </section>
    </div>
  );
}
