import Link from "next/link";
import { PencilLine } from "lucide-react";
import { NoteDto } from "@/types/dto/note.dto";
import LogOut from "./LogOut";
import SearchForm from "./SearchForm";
import LanguageSelector from "./LanguageSelector";

export default function Header({
  notes,
  auth,
}: {
  notes: NoteDto[];
  auth: any;
}) {
  return (
    <header>
      <nav className="bg-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link className="font-bold text-lg mr-3" href={"/"}>
            NoteTaking
          </Link>
          <div className="flex items-center ml-auto">
            <SearchForm notes={notes} />
            <Link
              href="/note/create"
              className="mr-3 p-2 hover:shadow-md hover:shadow-stone-950"
            >
              <PencilLine className="size-6" />
            </Link>
          </div>
          {auth ? (
            <LogOut />
          ) : (
            <Link
              className="text-gray-800 no-underline mr-3"
              href={"/user/login"}
            >
              <span className="cursor-pointer">Iniciar sesión</span>
            </Link>
          )}
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
}
