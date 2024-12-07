import Header from "@/components/Header";
import { notesApi } from "@/api/notes.api";
import { NoteDto } from "@/types/dto/note.dto";
import { getAuthCookie } from "./action";
import "./globals.css";

import { LanguageProvider } from "@/contexts/LanguageContext";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const notes: NoteDto[] = await notesApi.getAllNotesOfUser();
  const auth = await getAuthCookie();

  return (
    <html lang="en">
      <body className="bg-gray-200">
        <LanguageProvider>
          <Header notes={notes} auth={auth} />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}