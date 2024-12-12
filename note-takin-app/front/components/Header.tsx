import Link from "next/link";
import { NoteDto } from "@/types/dto/note.dto";
import LogOut from "./LogOut";
import SearchForm from "./SearchForm";
import LanguageSelector from "./LanguageSelector";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import ChooseNoteAdd from "./ChooseNoteAdd";

export default async function Header({
  notes,
  auth,
}: {
  notes: NoteDto[];
  auth: RequestCookie | undefined;
}) {
  const cookieStore = await cookies();
  const language = cookieStore.get("appLanguage")?.value;

  return (
    <header>
      <nav className="bg-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link className="font-bold text-lg mr-3" href={"/"}>
            NoteTaking
          </Link>
          <div className="flex items-center ml-auto">
            <SearchForm notes={notes} />
            <ChooseNoteAdd />
          </div>
          {auth ? (
            <LogOut />
          ) : (
            <Link
              className="text-gray-800 no-underline mr-3"
              href={"/user/login"}
            >
              <span className="cursor-pointer">
                {language === "en" ? "Log in" : "Iniciar sesión"}
              </span>
            </Link>
          )}
          <LanguageSelector />
        </div>
      </nav>
    </header>
  );
}
