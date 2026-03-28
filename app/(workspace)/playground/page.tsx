"use client"

import { useState } from "react"
import { LANGUAGES } from "@/app/types"
import type { DifficultyKey, LanguageKey, Problema } from "@/app/types"
import type { ExecuteResult } from "@/app/api/execute/route"
import PlaygroundNavbar from "@/app/components/playground/PlaygroundNavbar"
import ProblemInformation from "@/app/components/playground/ProblemInformation"
import ProblemStatement from "@/app/components/playground/ProblemStatement"
import CodeEditor from "@/app/components/playground/CodeEditor"
import Console from "@/app/components/playground/Console"

const getStarter = (key: LanguageKey) =>
  LANGUAGES.find((l) => l.key === key)?.starter ?? ""

export default function Playground() {
  const [dificultad, setDificultad] = useState<DifficultyKey>("warmup")
  const [lenguaje, setLenguaje] = useState<LanguageKey>("javascript")
  const [codigo, setCodigo] = useState(getStarter("javascript"))
  const [problema, setProblema] = useState<Problema | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<ExecuteResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  function handleLenguajeChange(key: LanguageKey) {
    setLenguaje(key)
    setCodigo(getStarter(key))
  }

  async function handleGenerateProblem() {
    setIsLoading(true)
    setProblema(null)
    setCodigo(getStarter(lenguaje))
    setConsoleOutput(null)
    try {
      const res = await fetch(`/api/get-problem?difficulty=${dificultad}`)
      if (!res.ok) throw new Error("API error")
      const data: Problema = await res.json()
      setProblema(data)
    } catch {
      // TODO: show toast error
    } finally {
      setIsLoading(false)
    }
  }

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
      </div>
    </>
  )
}
