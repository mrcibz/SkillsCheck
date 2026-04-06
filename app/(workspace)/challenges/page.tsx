"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { DIFFICULTY_RANGES } from "@/app/types"
import type { DifficultyKey, LCDifficulty } from "@/app/types"
import type { ListedProblem } from "@/app/api/list-problems/route"
import { COMPANIES } from "@/app/data/companies"
import { getCompanyForSlug, getValidationForSlug } from "@/app/lib/challengeMeta"

type DiffFilter = DifficultyKey | "any"

const DIFFICULTY_PILL_STYLE: Record<LCDifficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
}

export default function ChallengesPage() {
  const [problems, setProblems] = useState<ListedProblem[]>([])
  // Initialize loading=true so the very first mount renders the skeleton
  // without us having to setState synchronously inside the effect (lint:
  // react-hooks/set-state-in-effect). All subsequent loading transitions
  // are driven by the difficulty handler below.
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<DiffFilter>("any")
  const [company, setCompany] = useState<string>("all")
  const [search, setSearch] = useState("")

  function changeDifficulty(next: DiffFilter) {
    if (next === difficulty) return
    setIsLoading(true)
    setError(null)
    setDifficulty(next)
  }

  useEffect(() => {
    let cancelled = false
    const url =
      difficulty === "any"
        ? "/api/list-problems?limit=120"
        : `/api/list-problems?difficulty=${difficulty}&limit=120`
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error ?? "Failed to load challenges")
        }
        return res.json() as Promise<{ problems: ListedProblem[] }>
      })
      .then((data) => {
        if (cancelled) return
        setProblems(data.problems)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Unknown error")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [difficulty])

  // Annotate with deterministic company + validation status, then apply
  // company/search filters client-side (cheap, all data already in memory).
  const annotated = useMemo(
    () =>
      problems.map((p) => ({
        ...p,
        company: getCompanyForSlug(p.slug),
        validation: getValidationForSlug(p.slug),
      })),
    [problems],
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return annotated.filter((p) => {
      if (company !== "all" && p.company !== company) return false
      if (q && !p.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [annotated, company, search])

  // Sort companies alphabetically for the dropdown — keeps the UI predictable
  // even though COMPANIES is hand-ordered.
  const sortedCompanies = useMemo(() => [...COMPANIES].sort(), [])

  return (
    <div className="min-h-screen bg-[#0B1628] text-slate-100">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-slate-700/60 bg-[#0d1b2e] px-6 h-14">
        {/* This page does NOT host Monaco, so a soft client-side nav back to
            home is fine here (no Activity-reuse hazard). */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.svg" alt="SkillsCheck" width={120} height={24} priority />
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="/playground"
            className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400"
          >
            Random Playground
          </a>
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
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Company Challenges
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
            Browse the curated pool of problems offered by top tech companies.
            Pick one and jump straight into the editor.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg bg-slate-800/70 p-1 gap-1">
            <button
              onClick={() => changeDifficulty("any")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                difficulty === "any"
                  ? "bg-blue-500 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              All
            </button>
            {DIFFICULTY_RANGES.map((range) => (
              <button
                key={range.key}
                onClick={() => changeDifficulty(range.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  difficulty === range.key
                    ? "bg-blue-500 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                }`}
              >
                {range.sublabel}
              </button>
            ))}
          </div>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="rounded-lg bg-slate-800/70 px-3 py-2 text-xs font-semibold text-slate-300 border border-slate-700/50 outline-none cursor-pointer"
          >
            <option value="all">All companies</option>
            {sortedCompanies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="flex-1 min-w-[200px] rounded-lg bg-slate-800/70 px-3 py-2 text-xs font-semibold text-slate-300 placeholder:text-slate-500 border border-slate-700/50 outline-none focus:border-blue-500"
          />

          <span className="ml-auto text-xs text-slate-500">
            {isLoading ? "Loading…" : `${visible.length} challenge${visible.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {/* Content */}
        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {isLoading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-[#0e1d33]"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && visible.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-[#0e1d33] p-10 text-center text-slate-400">
            No challenges match your filters.
          </div>
        )}

        {!isLoading && !error && visible.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <a
                // Plain <a>: full-document nav into /playground so Monaco mounts
                // cleanly. See feedback_monaco_prefetch.md.
                key={p.slug}
                href={`/playground?slug=${encodeURIComponent(p.slug)}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-[#0e1d33] p-5 text-left transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    {p.company}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      DIFFICULTY_PILL_STYLE[p.difficulty]
                    }`}
                  >
                    {p.difficulty}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-blue-300">
                  {p.title}
                </h3>
                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tags.length > 3 && (
                      <span className="rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        +{p.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-slate-500">
                  <span>Acceptance {p.acRate.toFixed(1)}%</span>
                  {p.validation.validated ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-300">
                      Validated · {p.validation.score}
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 font-semibold text-slate-400">
                      Pending review
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
