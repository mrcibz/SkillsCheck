"use client"

import Editor from "@monaco-editor/react"
import { LANGUAGES } from "@/app/types"
import type { LanguageKey } from "@/app/types"

type Props = {
  codigo: string
  lenguaje: LanguageKey
  onChange: (value: string) => void
}

export default function CodeEditor({ codigo, lenguaje, onChange }: Props) {
  const monacoId = LANGUAGES.find((l) => l.key === lenguaje)?.monacoId ?? "javascript"

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={monacoId}
        value={codigo}
        onChange={(value) => onChange(value ?? "")}
        loading={
          <div className="flex h-full items-center justify-center bg-[#1e1e1e]">
            <div className="h-6 w-6 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin" />
          </div>
        }
        options={{
          fontSize: 14,
          fontFamily: "var(--font-geist-mono)",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          wordWrap: "on",
          tabSize: 2,
          padding: { top: 12 },
        }}
      />
    </div>
  )
}
