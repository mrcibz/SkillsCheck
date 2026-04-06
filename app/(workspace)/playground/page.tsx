"use client"

import { useState, useEffect } from "react"
import { LANGUAGES, DIFFICULTY_RANGES } from "@/app/types"
import type { DifficultyKey, LanguageKey, Problema, ProfileEntry } from "@/app/types"
import type { ExecuteResult } from "@/app/api/execute/route"
import PlaygroundNavbar from "@/app/components/playground/PlaygroundNavbar"
import ProblemInformation from "@/app/components/playground/ProblemInformation"
import ProblemStatement from "@/app/components/playground/ProblemStatement"
import CodeEditor from "@/app/components/playground/CodeEditor"
import Console from "@/app/components/playground/Console"
import { getCompanyForSlug } from "@/app/lib/challengeMeta"
import { saveProfileEntry } from "@/app/lib/profileStorage"

const getStarter = (key: LanguageKey) =>
  LANGUAGES.find((l) => l.key === key)?.starter ?? ""

// Accepted ?difficulty= values in the URL: any known DifficultyKey or the
// pseudo-key "any" (random across all difficulties, resolved by the API).
type DifficultyParam = DifficultyKey | "any"

const isValidDifficultyParam = (value: string | null): value is DifficultyParam =>
  value === "any" || (!!value && DIFFICULTY_RANGES.some((d) => d.key === value))

export default function Playground() {
  const [dificultad, setDificultad] = useState<DifficultyKey>("warmup")
  const [lenguaje, setLenguaje] = useState<LanguageKey>("javascript")
  const [codigo, setCodigo] = useState(getStarter("javascript"))
  const [problema, setProblema] = useState<Problema | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<ExecuteResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitNotice, setSubmitNotice] = useState<string | null>(null)

  function handleLenguajeChange(key: LanguageKey) {
    setLenguaje(key)
    setCodigo(getStarter(key))
  }

  async function handleGenerateProblem(overrideDifficulty?: DifficultyParam) {
    const target: DifficultyParam = overrideDifficulty ?? dificultad
    setIsLoading(true)
    setProblema(null)
    setCodigo(getStarter(lenguaje))
    setConsoleOutput(null)
    try {
      const res = await fetch(`/api/get-problem?difficulty=${target}`)
      if (!res.ok) throw new Error("API error")
      const data: Problema = await res.json()
      setProblema(data)
    } catch {
      // TODO: show toast error
    } finally {
      setIsLoading(false)
    }
  }

  // On mount: honour ?difficulty=<key> from the query string (used by the
  // profile empty-state suggestions) and auto-load a problem. We pass the
  // difficulty explicitly to avoid reading stale state before the setDificultad
  // update is committed.
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const raw = params.get("difficulty")
    if (!isValidDifficultyParam(raw)) return

    // "any" is not a real difficulty — the API resolves it to a random problem
    // across all levels. Keep the pill state on the current default and just
    // fire the fetch with the override.
    if (raw !== "any") {
      setDificultad(raw)
    }
    handleGenerateProblem(raw)
    // Mount-only effect by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleRunCode() {
    setIsRunning(true)
    setConsoleOutput(null)
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, lenguaje }),
      })
      const data = await res.json()
      if (!res.ok) {
        setConsoleOutput({
          output: data.error ?? "Execution service returned an error.",
          status: "Error",
          statusId: 0,
          time: null,
        })
      } else {
        setConsoleOutput(data as ExecuteResult)
      }
    } catch {
      setConsoleOutput({
        output: "Failed to connect to execution service.",
        status: "Error",
        statusId: 0,
        time: null,
      })
    } finally {
      setIsRunning(false)
    }
  }

  async function handleSubmit() {
    if (!problema) return
    setIsSubmitting(true)
    try {
      const entry: ProfileEntry = {
        slug: problema.slug,
        title: problema.title,
        difficulty: problema.difficulty,
        company: getCompanyForSlug(problema.slug),
        submittedAt: Date.now(),
        code: codigo,
        language: lenguaje,
      }
      saveProfileEntry(entry)
      setSubmitNotice("Your solution has been sent for validation")
      setTimeout(() => setSubmitNotice(null), 3500)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = !!problema && codigo.trim().length > 0

  return (
    <>
      {/* ── Mobile blocker ── */}
      <div className="flex md:hidden h-screen flex-col items-center justify-center gap-6 bg-[#0B1628] px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-4xl">
          🖥️
        </div>
        <h1 className="text-2xl font-bold text-white">Better on a bigger screen</h1>
        <p className="max-w-xs text-base leading-relaxed text-slate-400">
          The playground is designed for a desktop experience. Open it on your
          computer for the best results.
        </p>
      </div>

      {/* ── Desktop playground ── */}
      <div className="hidden md:grid h-screen overflow-hidden grid-rows-[56px_1fr] bg-[#0B1628]">

        <PlaygroundNavbar
          dificultad={dificultad}
          onDificultadChange={setDificultad}
          onGenerate={handleGenerateProblem}
          isLoading={isLoading}
          lenguaje={lenguaje}
          onLenguajeChange={handleLenguajeChange}
          onRun={handleRunCode}
          isRunning={isRunning}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
        />

        <div className="grid grid-cols-2 overflow-hidden">

          {/* Left column */}
          <div className="flex flex-col overflow-hidden border-r border-slate-700/50">
            <div className="h-[88px] shrink-0">
              <ProblemInformation problema={problema} />
            </div>
            <div className="flex-1 overflow-hidden">
              <ProblemStatement
                problema={problema}
                isLoading={isLoading}
                onGenerate={handleGenerateProblem}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex-[7] overflow-hidden">
              <CodeEditor
                codigo={codigo}
                lenguaje={lenguaje}
                onChange={setCodigo}
              />
            </div>
            <div className="flex-[3] overflow-hidden">
              <Console
                output={consoleOutput}
                isRunning={isRunning}
                onClear={() => setConsoleOutput(null)}
              />
            </div>
          </div>

        </div>

        {/* Submit confirmation toast */}
        {submitNotice && (
          <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 shadow-lg backdrop-blur">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.2 7.25a1 1 0 0 1-1.42.005l-3.8-3.8a1 1 0 1 1 1.415-1.414l3.09 3.09 6.494-6.54a1 1 0 0 1 1.415-.006Z" clipRule="evenodd" />
              </svg>
              {submitNotice}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
