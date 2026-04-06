"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname()
  const isOnProfile = pathname === "/profile"

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1628]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="SkillsCheck" width={140} height={28} priority />
        </Link>

        {/* Botones a la derecha (Siempre visibles en móvil y PC) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isOnProfile && (
            <Link
              href="/profile"
              className="inline-flex h-9 items-center rounded-full border border-slate-700 px-4 text-sm font-semibold text-slate-300 transition-all hover:border-blue-500 hover:text-white"
            >
              Profile
            </Link>
          )}
          <Link
            href="/playground"
            prefetch={false}
            className="inline-flex h-9 items-center rounded-full bg-blue-500 px-5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Practice
          </Link>
        </div>

      </div>
    </nav>
  );
}
