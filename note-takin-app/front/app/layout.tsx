import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { notesApi } from "@/api/notes.api";
import { NoteDto } from "@/types/dto/note.dto";
import { getAuthCookie } from "./action";

export const metadata: Metadata = {
  title: "NoteTaking",
  description: "created by simon pero",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notes: NoteDto[] = await notesApi.getAllNotesOfUser();
  const auth = await getAuthCookie();
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <Header notes={notes} auth={auth} />
        {children}
      </body>
    </html>
  );
}
