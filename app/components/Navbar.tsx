"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1628]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="SkillsCheck" width={140} height={28} priority />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 sm:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <Link
            href="/"
            className="ml-2 inline-flex h-9 items-center rounded-full bg-blue-500 px-5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Practice
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 sm:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-slate-300 transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-slate-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-slate-300 transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-slate-800 px-6 py-4 sm:hidden animate-slide-in-top animate-duration-200">
          <NavLink href="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-9 items-center justify-center rounded-full bg-blue-500 px-5 text-sm font-semibold text-white transition-all hover:bg-blue-600"
          >
            Practice
          </Link>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-500"
    >
      {children}
    </Link>
  );
}
