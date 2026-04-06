import type { ProfileEntry } from "@/app/types"

const STORAGE_KEY = "skillscheck:profile:v1"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function getProfileEntries(): ProfileEntry[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ProfileEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/**
 * Upserts an entry by slug (latest submission wins) and returns the updated list.
 * Sorted by submittedAt desc so the profile page can render it directly.
 */
export function saveProfileEntry(entry: ProfileEntry): ProfileEntry[] {
  if (!isBrowser()) return []
  const current = getProfileEntries().filter((e) => e.slug !== entry.slug)
  const next = [entry, ...current].sort((a, b) => b.submittedAt - a.submittedAt)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota exceeded / storage disabled — ignore, this is an MVP.
  }
  return next
}

export function clearProfileEntries(): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
