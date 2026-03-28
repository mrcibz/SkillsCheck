"use client"

import { useState } from "react"
import type { DifficultyKey, Problema } from "@/app/types"
import PlaygroundNavbar from "@/app/components/playground/PlaygroundNavbar"
import ProblemInformation from "@/app/components/playground/ProblemInformation"
import ProblemStatement from "@/app/components/playground/ProblemStatement"
import CodeEditor from "@/app/components/playground/CodeEditor"
import Console from "@/app/components/playground/Console"

export default function Playground() {
  const [dificultad, setDificultad] = useState<DifficultyKey>("warmup")
  const [lenguaje, setLenguaje] = useState("javascript")
  const [codigo, setCodigo] = useState("")
  const [consolaOutput, setConsolaOutput] = useState("")
  const [problema, setProblema] = useState<Problema | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  void lenguaje, setLenguaje, codigo, setCodigo, consolaOutput, setConsolaOutput

  async function handleGenerateProblem() {
    setIsLoading(true)
    setProblema(null)
    try {
      const res = await fetch(`/api/get-problem?difficulty=${dificultad}`)
      if (!res.ok) throw new Error("API error")
      const data: Problema = await res.json()
      setProblema(data)
    } catch {
      // TODO: show toast error (Fase 3)
    } finally {
      setIsLoading(false)
    }
  }

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

        {/* Navbar — full width */}
        <PlaygroundNavbar
          dificultad={dificultad}
          onDificultadChange={setDificultad}
          onGenerate={handleGenerateProblem}
          isLoading={isLoading}
        />

        {/* Body — two columns */}
        <div className="grid grid-cols-2 overflow-hidden">

          {/* Left column: problem info (fixed) + statement (scrollable) */}
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

          {/* Right column: editor (70%) + console (30%) */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex-[7] overflow-hidden">
              <CodeEditor />
            </div>
            <div className="flex-[3] overflow-hidden">
              <Console />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
