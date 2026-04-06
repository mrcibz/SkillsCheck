import { COMPANIES } from "@/app/data/companies"
import { FEEDBACK_POOL } from "@/app/data/feedback"
import type { ValidationResult } from "@/app/types"

/**
 * FNV-1a 32-bit hash. Deterministic, fast, zero-dependency.
 * We use it purely to derive stable "fake" metadata from a challenge slug
 * (company, validation status, score, feedback). Not for anything security-sensitive.
 */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h >>> 0
}

export function getCompanyForSlug(slug: string): string {
  return COMPANIES[hash(slug + ":company") % COMPANIES.length]
}

/**
 * Deterministically decide whether a challenge is "already validated" or still
 * "pending review". Roughly 45% of challenges fall into the validated bucket.
 *
 * When validated, the score (60-95) and feedback are also derived from the slug
 * so the same challenge always yields the same result.
 */
export function getValidationForSlug(slug: string): ValidationResult {
  const bucket = hash(slug + ":status") % 100
  const validated = bucket < 45
  if (!validated) return { validated: false }

  const score = 60 + (hash(slug + ":score") % 36)   // 60-95
  const feedback = FEEDBACK_POOL[hash(slug + ":fb") % FEEDBACK_POOL.length]
  return { validated: true, score, feedback }
}
