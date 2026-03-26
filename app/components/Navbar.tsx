import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1628]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="SkillsCheck" width={140} height={28} priority />
        </Link>

        {/* Botón a la derecha (Siempre visible en móvil y PC) */}
        <div className="flex items-center">
          <Link
            href="/" /* Cámbialo a "/practice" si tienes una ruta específica */
            className="inline-flex h-9 items-center rounded-full bg-blue-500 px-5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Practice
          </Link>
        </div>

      </div>
    </nav>
  );
}