import type { Problema } from "@/app/types"

type Props = {
  problema: Problema | null
  isLoading: boolean
  onGenerate: () => void
}

export default function ProblemStatement({ problema, isLoading, onGenerate }: Props) {

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#0B1628]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin" />
        <p className="text-sm text-slate-500">Loading problem…</p>
      </div>
    )
  }

  if (!problema) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 bg-[#0B1628] px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
          📋
        </div>
        <div>
          <p className="text-base font-semibold text-white">No problem loaded</p>
          <p className="mt-1 text-sm text-slate-500">
            Select a difficulty and generate a problem to get started.
          </p>
        </div>
        <button
          onClick={onGenerate}
          className="mt-2 rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105"
        >
          Generate New Problem
        </button>
      </div>
    )
  }

  if (problema.content) {
    return (
      <div
        className="lc-content h-full overflow-y-auto bg-[#0B1628] px-6 py-5"
        dangerouslySetInnerHTML={{ __html: problema.content }}
      />
    )
  }

  // Fallback: content unavailable (auth issue, etc.)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#0B1628] px-8 text-center">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-700 p-8">
        <p className="text-sm text-slate-500 leading-relaxed">
          Statement preview unavailable.
          <br />
          Open the full problem on LeetCode.
        </p>
        <a
          href={problema.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105"
        >
          Open on LeetCode →
        </a>
      </div>
    </div>
  )
}
