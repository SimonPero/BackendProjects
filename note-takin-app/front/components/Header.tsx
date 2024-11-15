import { getAuthCookie } from "@/app/action";
import Link from "next/link";

export default async function Header() {
  const auth = await getAuthCookie();
  console.log(auth);
  return (
    <header>
      <nav className="bg-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link className="font-bold text-lg" href={"/"}>
            Logo
          </Link>
          <div className="flex items-center ml-auto">
            {auth ? (
              <span className="cursor-pointer mr-3">Cerrar sesión</span>
            ) : (
              <Link
                className="text-gray-800 no-underline mr-3"
                href={"/user/login"}
              >
                <span className="cursor-pointer">Iniciar sesión</span>
              </Link>
            )}
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
              className="text-gray-800 no-underline mr-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </Link>
            <button
              className="navbar-toggler mr-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarScroll"
              aria-controls="navbarScroll"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
