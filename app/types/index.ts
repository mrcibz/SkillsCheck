// ── Problema ──────────────────────────────────────────────────────────────────

export type LCDifficulty = 'Easy' | 'Medium' | 'Hard'

export type Problema = {
  title: string
  difficulty: LCDifficulty
  tags: string[]
  slug: string
  url: string
  content: string | null  // HTML completo del enunciado, null si no disponible
}

// ── Profile / Validation ──────────────────────────────────────────────────────

export type ChallengeStatus = 'not_started' | 'submitted' | 'validated'

/**
 * Deterministic "validation" of a challenge, derived from its slug.
 * See app/lib/challengeMeta.ts → getValidationForSlug.
 */
export type ValidationResult = {
  validated: boolean
  score?: number     // 0-100, only when validated
  feedback?: string  // only when validated
}

/**
 * Entry persisted in localStorage after the user submits a solution.
 * We only store "submitted" entries; the "validated" status is derived at
 * read-time from the deterministic mapping in challengeMeta.
 */
export type ProfileEntry = {
  slug: string
  title: string
  difficulty: LCDifficulty
  company: string
  submittedAt: number
  code: string
  language: LanguageKey
}

// ── Difficulty ────────────────────────────────────────────────────────────────

export type DifficultyKey = 'warmup' | 'junior' | 'intermediate' | 'advanced'

export type DifficultyRange = {
  key: DifficultyKey
  label: string
  sublabel: string
  lcDifficulty: LCDifficulty
  minAcRate?: number  // % mínimo de aceptación (problemas más fáciles dentro del nivel)
  maxAcRate?: number  // % máximo de aceptación (problemas más difíciles dentro del nivel)
}

export const DIFFICULTY_RANGES: DifficultyRange[] = [
  { key: 'warmup',       label: 'Beginner',     sublabel: 'Warm-up',  lcDifficulty: 'Easy',   minAcRate: 55 },
  { key: 'junior',       label: 'Junior',       sublabel: 'Easy',     lcDifficulty: 'Easy',   maxAcRate: 55 },
  { key: 'intermediate', label: 'Intermediate', sublabel: 'Normal',   lcDifficulty: 'Medium' },
  { key: 'advanced',     label: 'Advanced',     sublabel: 'Hard',     lcDifficulty: 'Hard'   },
]

// ── Language ──────────────────────────────────────────────────────────────────

export type LanguageKey = 'javascript' | 'python' | 'cpp' | 'java'

export type Language = {
  key: LanguageKey
  label: string
  monacoId: string
  judge0Id: number
  starter: string
}

export const LANGUAGES: Language[] = [
  {
    key: 'javascript',
    label: 'JavaScript',
    monacoId: 'javascript',
    judge0Id: 93,
    starter: '/**\n * @param {*} input\n */\nfunction solution(input) {\n  // Write your solution here\n}\n\nconsole.log(solution(null))\n',
  },
  {
    key: 'python',
    label: 'Python',
    monacoId: 'python',
    judge0Id: 92,
    starter: 'def solution(input):\n    # Write your solution here\n    pass\n\nprint(solution(None))\n',
  },
  {
    key: 'cpp',
    label: 'C++',
    monacoId: 'cpp',
    judge0Id: 54,
    starter: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
  },
  {
    key: 'java',
    label: 'Java',
    monacoId: 'java',
    judge0Id: 62,
    starter: 'class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
  },
]
