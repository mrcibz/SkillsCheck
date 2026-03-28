"use client"

import Link from "next/link"
import Image from "next/image"
import { DIFFICULTY_RANGES, LANGUAGES } from "@/app/types"
import type { DifficultyKey, LanguageKey } from "@/app/types"

type Props = {
  dificultad: DifficultyKey
  onDificultadChange: (key: DifficultyKey) => void
  onGenerate: () => void
  isLoading: boolean
  lenguaje: LanguageKey
  onLenguajeChange: (key: LanguageKey) => void
  onRun: () => void
  isRunning: boolean
}

export default function PlaygroundNavbar({
  dificultad,
  onDificultadChange,
  onGenerate,
  isLoading,
  lenguaje,
  onLenguajeChange,
  onRun,
  isRunning,
}: Props) {
  return (
    <nav className="flex items-center justify-between px-4 border-b border-slate-700/60 bg-[#0d1b2e] h-full gap-4">

      {/* Left — logo */}
      <Link href="/" className="flex-shrink-0">
        <Image src="/logo.svg" alt="SkillsCheck" width={120} height={24} priority />
      </Link>

      {/* Center — difficulty pills + generate button */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg bg-slate-800/70 p-1 gap-1">
          {DIFFICULTY_RANGES.map((range) => (
            <button
              key={range.key}
              onClick={() => onDificultadChange(range.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                dificultad === range.key
                  ? "bg-blue-500 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              {range.sublabel}
            </button>
          ))}
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Loading…
            </>
          ) : (
            "New Problem"
          )}
        </button>
      </div>

      {/* Right — language selector + run button (visual, Fase 3) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <select
          value={lenguaje}
          onChange={(e) => onLenguajeChange(e.target.value as LanguageKey)}
          className="rounded-lg bg-slate-800/70 px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700/50 outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.key} value={l.key}>{l.label}</option>
          ))}
        </select>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isRunning ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-slate-400/30 border-t-slate-300 animate-spin" />
              Running…
            </>
          ) : (
            "▶ Run"
          )}
        </button>
      </div>

    </nav>
  )
}
