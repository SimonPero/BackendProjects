import Header from "@/components/Header";
import { notesApi } from "./api/notes.api";
import { NoteDto } from "@/types/dto/note.dto";
import { getAuthCookie } from "./actions";
import "./globals.css";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const auth = await getAuthCookie();
  let notes: NoteDto[] = [];
  if (auth?.value !== "") {
    notes = await notesApi.getAllNotesOfUser(auth);
  }

  return (
    <html lang="en">
      <body className="bg-gray-200">
        <LanguageProvider>
          <Header notes={notes} auth={auth} />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
