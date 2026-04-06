"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { ProfileEntry, ValidationResult } from "@/app/types"
import { DIFFICULTY_RANGES } from "@/app/types"
import { getProfileEntries, clearProfileEntries } from "@/app/lib/profileStorage"
import { getValidationForSlug } from "@/app/lib/challengeMeta"
import Modal from "@/app/components/ui/Modal"

type EnrichedEntry = ProfileEntry & { validation: ValidationResult }

// Suggested entry-level difficulties for the empty state.
const SUGGESTED = DIFFICULTY_RANGES.filter((d) =>
  ["warmup", "junior", "intermediate"].includes(d.key)
)

export default function ProfilePage() {
  const [entries, setEntries] = useState<EnrichedEntry[] | null>(null)
  const [clearOpen, setClearOpen] = useState(false)
  const [feedbackEntry, setFeedbackEntry] = useState<EnrichedEntry | null>(null)

  // Hydrate client-only state from localStorage on mount. The setState call is
  // intentional — we're reading from an external store that isn't available
  // during SSR, so we can't derive this synchronously in a useState initializer.
  useEffect(() => {
    const raw = getProfileEntries()
    const enriched = raw.map((e) => ({
      ...e,
      validation: getValidationForSlug(e.slug),
    }))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(enriched)
  }, [])

  function handleClearConfirmed() {
    clearProfileEntries()
    setEntries([])
    setClearOpen(false)
  }

  // Initial render before the useEffect runs — keep layout stable.
  if (entries === null) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-40 rounded bg-slate-800/70 animate-pulse" />
      </div>
    )
  }

  const validatedCount = entries.filter((e) => e.validation.validated).length
  const pendingCount = entries.length - validatedCount

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Your profile
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
            Submitted challenges
          </h1>
          {entries.length > 0 && (
            <p className="mt-2 text-sm text-slate-400">
              {entries.length} total · {validatedCount} validated · {pendingCount} pending
            </p>
          )}
        </div>
        {entries.length > 0 && (
          <button
            onClick={() => setClearOpen(true)}
            className="self-start rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-red-500/60 hover:text-red-400 sm:self-auto"
          >
            Clear all
          </button>
        )}
      </header>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <EntriesList entries={entries} onShowFeedback={setFeedbackEntry} />
      )}

      {/* Clear-all confirmation modal */}
      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear your profile?"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setClearOpen(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClearConfirmed}
              className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-red-600"
            >
              Clear all
            </button>
          </>
        }
      >
        <p>
          This will permanently remove all submitted challenges from this
          browser. You can&apos;t undo this action.
        </p>
      </Modal>

      {/* Feedback modal */}
      <Modal
        open={!!feedbackEntry}
        onClose={() => setFeedbackEntry(null)}
        title="Reviewer feedback"
        size="lg"
        footer={
          <button
            type="button"
            onClick={() => setFeedbackEntry(null)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-600"
          >
            Close
          </button>
        }
      >
        {feedbackEntry && feedbackEntry.validation.validated && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  {feedbackEntry.company}
                </p>
                <h3 className="mt-1 truncate text-lg font-bold text-white">
                  {feedbackEntry.title}
                </h3>
              </div>
              {feedbackEntry.validation.score !== undefined && (
                <div className="shrink-0 text-right">
                  <p className="text-3xl font-bold text-white leading-none">
                    {feedbackEntry.validation.score}
                    <span className="text-base font-medium text-slate-500">
                      /100
                    </span>
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Validated
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Comment
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-slate-200">
                “{feedbackEntry.validation.feedback}”
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Reviewed by a SkillsCheck evaluator on behalf of{" "}
              {feedbackEntry.company}.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

function EntriesList({
  entries,
  onShowFeedback,
}: {
  entries: EnrichedEntry[]
  onShowFeedback: (entry: EnrichedEntry) => void
}) {
  return (
    <ul className="flex flex-col gap-4">
      {entries.map((e) => (
        <li
          key={e.slug}
          className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-slate-700"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <span className="text-blue-400">{e.company}</span>
                <span className="text-slate-600">·</span>
                <DifficultyBadge difficulty={e.difficulty} />
              </div>
              <h2 className="mt-2 truncate text-lg font-bold text-white">
                {e.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Submitted {formatDate(e.submittedAt)}
              </p>
            </div>

            <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end">
              <StatusPill validation={e.validation} />
              {e.validation.validated && e.validation.score !== undefined && (
                <p className="text-3xl font-bold text-white leading-none">
                  {e.validation.score}
                  <span className="text-base font-medium text-slate-500">
                    /100
                  </span>
                </p>
              )}
              {e.validation.validated && (
                <button
                  type="button"
                  onClick={() => onShowFeedback(e)}
                  className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:text-emerald-200"
                >
                  See feedback →
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <div className="animate-fade-in rounded-3xl border border-slate-800 bg-slate-900/30 p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-blue-400"
        >
          <path d="M9 12h6" />
          <path d="M9 16h6" />
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-white">No challenges yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        You haven&apos;t submitted anything for validation. Pick a challenge below to
        start building your profile.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {SUGGESTED.map((d) => (
          <Link
            key={d.key}
            href={`/playground?difficulty=${d.key}`}
            prefetch={false}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-blue-500/60 hover:bg-slate-900"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              {d.sublabel}
            </span>
            <span className="text-base font-bold text-white">{d.label}</span>
            <span className="mt-auto pt-3 text-xs font-semibold text-slate-400 group-hover:text-blue-300">
              Try this →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/playground?difficulty=any"
          prefetch={false}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-all hover:text-blue-400"
        >
          Or surprise me with a random one →
        </Link>
      </div>
    </div>
  )
}

function StatusPill({ validation }: { validation: ValidationResult }) {
  if (validation.validated) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Validated
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
      Pending validation
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: ProfileEntry["difficulty"] }) {
  const colors: Record<ProfileEntry["difficulty"], string> = {
    Easy: "text-green-400",
    Medium: "text-amber-400",
    Hard: "text-red-400",
  }
  return <span className={colors[difficulty]}>{difficulty}</span>
}

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return ""
  }
}
