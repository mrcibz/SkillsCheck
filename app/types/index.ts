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
  { key: 'warmup',       label: 'Principiante', sublabel: 'Warm-up',  lcDifficulty: 'Easy',   minAcRate: 55 },
  { key: 'junior',       label: 'Junior',       sublabel: 'Easy',     lcDifficulty: 'Easy',   maxAcRate: 55 },
  { key: 'intermediate', label: 'Intermedio',   sublabel: 'Normal',   lcDifficulty: 'Medium' },
  { key: 'advanced',     label: 'Difícil',      sublabel: 'Advanced', lcDifficulty: 'Hard'   },
]
