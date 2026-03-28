"use client"

import type { ExecuteResult } from "@/app/api/execute/route"

type Props = {
  output: ExecuteResult | null
  isRunning: boolean
  onClear: () => void
}

const STATUS_COLORS: Record<number, string> = {
  3: "text-emerald-400",   // Accepted
  6: "text-yellow-400",    // Compilation Error
}
const DEFAULT_STATUS_COLOR = "text-red-400"

export default function Console({ output, isRunning, onClear }: Props) {
  return (
    <div className="flex h-full flex-col bg-[#0d0d0d] border-t border-slate-700/50 font-mono text-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 shrink-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Console
        </span>
        <button
          onClick={onClear}
          disabled={!output && !isRunning}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {isRunning ? (
          <div className="flex items-center gap-2 text-slate-500">
            <span className="h-3 w-3 rounded-full border border-slate-500 border-t-slate-300 animate-spin inline-block" />
            <span>Running…</span>
          </div>
        ) : output ? (
          <>
            {/* Status line */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-semibold ${STATUS_COLORS[output.statusId] ?? DEFAULT_STATUS_COLOR}`}>
                ● {output.status}
              </span>
              {output.time && (
                <span className="text-xs text-slate-600">{output.time}s</span>
              )}
            </div>
            {/* Output lines */}
            {(output.output ?? '').split('\n').map((line, i) => (
              <div key={i} className="text-green-400 leading-relaxed whitespace-pre-wrap break-all">
                {line || ' '}
              </div>
            ))}
          </>
        ) : (
          <span className="text-slate-700">Run your code to see output here.</span>
        )}
      </div>

    </div>
  )
}
