import { getAuthCookie } from "@/app/action";
import Link from "next/link";
import LogOut from "./LogOut";
import { PencilLine } from "lucide-react";

export default async function Header() {
  const auth = await getAuthCookie();

  console.log(auth);
  return (
    <header>
      <nav className="bg-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link className="font-bold text-lg" href={"/"}>
            NoteTaking
          </Link>
          <div className="flex items-center ml-auto">
            <div className="relative mr-3">
              <div className="flex" role="search">
                <input
                  className="form-input rounded-full pr-10 pl-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 absolute top-1/2 right-3 transform -translate-y-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
            </div>
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
        </div>
      </nav>
    </header>
  );
}
