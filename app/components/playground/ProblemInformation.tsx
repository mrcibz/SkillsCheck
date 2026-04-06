import type { Problema } from "@/app/types"
import { getCompanyForSlug } from "@/app/lib/challengeMeta"

type Props = {
  problema: Problema | null
}

const DIFFICULTY_STYLES = {
  Easy:   "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-yellow-500/15 text-yellow-400",
  Hard:   "bg-red-500/15 text-red-400",
}

const TAG_COLORS: Record<string, string> = {
  Array:              "bg-blue-500/15 text-blue-300",
  Math:               "bg-purple-500/15 text-purple-300",
  Greedy:             "bg-emerald-500/15 text-emerald-300",
  "Dynamic Programming": "bg-yellow-500/15 text-yellow-300",
  Tree:               "bg-orange-500/15 text-orange-300",
  Graph:              "bg-red-500/15 text-red-300",
  Sorting:            "bg-teal-500/15 text-teal-300",
  String:             "bg-pink-500/15 text-pink-300",
  "Hash Table":       "bg-indigo-500/15 text-indigo-300",
  "Binary Search":    "bg-cyan-500/15 text-cyan-300",
}
const DEFAULT_TAG = "bg-slate-700/60 text-slate-400"

export default function ProblemInformation({ problema }: Props) {
  if (!problema) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 border-b border-slate-700/50 bg-[#0d1b2e]">
        <p className="text-sm font-medium text-slate-500">No problem loaded</p>
        <p className="text-xs text-slate-600">Generate one to see its tags here.</p>
      </div>
    )
  }

  const company = getCompanyForSlug(problema.slug)

  return (
    <div className="flex h-full flex-col justify-center gap-2 px-6 border-b border-slate-700/50 bg-[#0d1b2e]">
      <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
        Offered by {company}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-bold text-white truncate">
          {problema.title}
        </span>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_STYLES[problema.difficulty]}`}>
          {problema.difficulty}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {problema.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${TAG_COLORS[tag] ?? DEFAULT_TAG}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
