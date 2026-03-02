import { useEffect, useState } from "react";
import Profile from "./nav/Profile";
import HomeSection from "./main/HomeSection";
import Menu from "./nav/Menu";

export default function Index() {
  const pages = [<HomeSection />];

  const [pageSelection, setPageSelection] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const localStorTheme = localStorage.getItem("theme");
    setDarkTheme(localStorTheme === "dark");
    setLoading(false);
  }, []);

  const changeTheme = () => {
    localStorage.setItem("theme", isDarkTheme ? "light" : "dark");
    setDarkTheme(!isDarkTheme);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className={isDarkTheme ? "dark" : ""}>
      <div className="min-h-screen bg-neutral-100 text-neutral-800 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5">
          <header className="flex items-center justify-between rounded-md bg-white px-5 py-4 shadow-sm dark:bg-neutral-900">
            <div></div>
            <label className="relative inline-flex h-6 w-12 items-center">
              <input
                role="switch"
                type="checkbox"
                onChange={changeTheme}
                checked={isDarkTheme}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full bg-neutral-300 transition peer-checked:bg-neutral-100"></span>
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6"></span>
            </label>
          </header>

          <main className="flex flex-col gap-4 lg:flex-row">
            <aside className="flex w-full flex-col gap-4 lg:w-80">
              <Profile />
              <Menu />
            </aside>
            {pages[pageSelection]}
          </main>

          <footer className="flex flex-col items-center justify-between gap-4 rounded-md bg-white px-5 py-4 text-sm shadow-sm dark:bg-neutral-900 sm:flex-row">
            <div>All rights reserved 2025 maruchi1203. Powered by GitHub</div>
            <div className="flex items-center gap-4">
              <img src="/images/typescript.png" className="h-7 w-auto" />
              <img src="/images/react.png" className="h-7 w-auto" />
              <img src="/images/github.png" className="h-7 w-auto" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
