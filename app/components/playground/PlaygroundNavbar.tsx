"use client"

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
  onSubmit: () => void
  canSubmit: boolean
  isSubmitting: boolean
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
  onSubmit,
  canSubmit,
  isSubmitting,
}: Props) {
  return (
    <nav className="flex items-center justify-between px-4 border-b border-slate-700/60 bg-[#0d1b2e] h-full gap-4">

      {/*
        Left — logo.
        NOTE: this is a plain <a>, not <Link>, on purpose. Next's client-side
        router parks the previous route in a hidden React <Activity> so it can
        be restored on back-nav. Monaco Editor is incompatible with that
        reconnect cycle (its InstantiationService gets disposed on hide and
        then crashes on reveal), so every outbound nav from /playground must
        do a full document navigation to fully unmount Monaco. Same reason
        the "Profile" icon below uses <a>.
      */}
      <a href="/" className="flex-shrink-0">
        <Image src="/logo.svg" alt="SkillsCheck" width={120} height={24} priority />
      </a>

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
          // Wrap so React's click event isn't forwarded as `overrideDifficulty`
          // to handleGenerateProblem (event stringifies to "[object Object]"
          // and the API falls back to the first difficulty range).
          onClick={() => onGenerate()}
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

      {/* Right — language + run + submit + profile */}
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

        <button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          title={canSubmit ? "Send your solution for validation" : "Load a problem and write a solution first"}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSubmitting ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit Work"
          )}
        </button>

        {/* Plain <a> so /playground fully unmounts — see comment on logo above. */}
        <a
          href="/challenges"
          title="Browse challenges by company"
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400 whitespace-nowrap"
        >
          Browse
        </a>

        {/* Plain <a> so /playground fully unmounts — see comment on logo above. */}
        <a
          href="/profile"
          title="View your profile"
          className="flex items-center justify-center rounded-lg border border-slate-600 h-[30px] w-[30px] text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400"
          aria-label="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6.5 8a6.5 6.5 0 0 1 13 0 .75.75 0 0 1-.75.75h-11.5A.75.75 0 0 1 3.5 18Z" />
          </svg>
        </a>
      </div>

    </nav>
  )
}
