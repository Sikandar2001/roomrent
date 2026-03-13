"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

import Image from "next/image";

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-zinc-700"
    >
      <path
        fillRule="evenodd"
        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.622 1.034 4.99 2.715 6.727A4.498 4.498 0 018.75 14.25h6.5a4.498 4.498 0 013.435 4.847zM15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M2.25 3.75A2.25 2.25 0 014.5 1.5h2.1c.966 0 1.8.66 2.023 1.6l.64 2.734a2.25 2.25 0 01-.565 2.107l-1.2 1.2a15.75 15.75 0 007.45 7.45l1.2-1.2a2.25 2.25 0 012.107-.565l2.734.64c.94.223 1.6 1.057 1.6 2.023V19.5a2.25 2.25 0 01-2.25 2.25H18a16.5 16.5 0 01-15.75-15.75v-2.25z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-[#FFF5E1]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 -ml-7">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-zinc-900"
          >
            <div className="relative h-16 w-16 overflow-hidden">
              <Image
                src="/images/image.png"
                alt="MKSUKO Logo"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-wide">MKSUKO</div>
              <div className="text-[12px] font-medium text-zinc-600">
                PROPERTY4U
              </div>
            </div>
          </Link>
        </div>
        <nav className="hidden items-center gap-2 lg:flex">
          <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            Home
          </Link>
          <Link href="/contact-us" className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            Contact Us
          </Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = search.trim();
              const target = `/?q=${encodeURIComponent(q)}#properties`;
              if (pathname === "/") {
                window.location.hash = "";
                window.location.href = target;
              } else {
                router.push(target);
              }
            }}
            className="mx-2 hidden items-center rounded-full border border-zinc-300 bg-white pl-3 pr-1 ring-blue-600/20 focus-within:ring-2 md:flex"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties by title ..."
              className="h-9 w-64 rounded-full px-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#113b8f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d3278]"
            >
              Search
            </button>
          </form>
          <div className="flex items-center gap-3">
            <Link
              href="/add-room"
              className="rounded-md bg-[#113b8f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0d3278]"
            >
              Add Room
            </Link>
          </div>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center rounded-full border border-zinc-200 bg-white/70 p-1 shadow-sm backdrop-blur transition-all hover:border-zinc-300 hover:shadow"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-zinc-50 to-zinc-200 ring-1 ring-inset ring-zinc-300">
                  <UserIcon />
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
                  <div className="bg-[#eab308]/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-700">User ID</p>
                    <p className="truncate text-xs text-zinc-900">{user.uid}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/edit-room"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Edit Room
                  </Link>
                  <Link
                    href="/dashboard/favourite"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Favourite Room
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-[#113b8f] px-4 py-2 text-sm font-semibold text-[#113b8f] hover:bg-[#113b8f]/10"
            >
              Login
            </Link>
          )}
          <a href="tel:8542898438" className="flex items-center gap-2">
            <PhoneIcon />
            <div className="leading-tight">
              <div className="text-xs font-semibold text-zinc-700">Phone Number</div>
              <div className="text-sm text-zinc-600 hover:underline">8542898438</div>
            </div>
          </a>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex items-center rounded-md border border-zinc-300 p-2"
            aria-label="Toggle search"
          >
            <SearchIcon />
          </button>
          <Link
            href="/add-room"
            className="rounded-md bg-[#113b8f] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0d3278]"
          >
            Add Room
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center rounded-md border border-zinc-300 p-2"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-zinc-200 bg-[#FFF5E1] lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = search.trim();
                setSearchOpen(false);
                router.push(`/?q=${encodeURIComponent(q)}#properties`);
              }}
              className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-2"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties by title ..."
                className="w-full rounded-full text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#113b8f] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
      {open && (
        <div className="border-t border-zinc-200 bg-[#FFF5E1] lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-zinc-800 hover:text-[#113b8f]"
              >
                Home
              </Link>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = search.trim();
                  setOpen(false);
                  router.push(`/?q=${encodeURIComponent(q)}#properties`);
                }}
                className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-2"
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search properties by title ..."
                  className="w-full rounded-full text-sm outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#113b8f] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Search
                </button>
              </form>
              <div className="mt-2 flex flex-col gap-4">
                {/* Always show Add Room button prominently on mobile menu - Moved under Search */}
                <Link
                  href="/add-room"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-[#113b8f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0d3278]"
                >
                  Add Room
                </Link>

                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-md bg-zinc-100 p-2">
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight">User ID</p>
                      <p className="truncate text-xs text-zinc-900">{user.uid}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setOpen(false)}
                        className="rounded-md border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/edit-room"
                        onClick={() => setOpen(false)}
                        className="rounded-md border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Edit Room
                      </Link>
                      <Link
                        href="/dashboard/favourite"
                        onClick={() => setOpen(false)}
                        className="rounded-md border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Favourites
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-md border border-[#113b8f] px-4 py-2.5 text-sm font-semibold text-[#113b8f] hover:bg-[#113b8f]/10"
                  >
                    Login
                  </Link>
                )}
              </div>
              <div className="mt-4 flex items-center justify-center gap-8 border-t border-zinc-200 pt-3">
                <a href="tel:8542898438" className="flex items-center gap-2 text-zinc-700">
                  <PhoneIcon />
                  <div className="text-sm hover:underline">8542898438</div>
                </a>
                <Link
                  href="/contact-us"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-800 hover:text-[#113b8f]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
