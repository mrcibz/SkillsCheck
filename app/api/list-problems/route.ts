import { NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'
import { LeetCode } from 'leetcode-query'
import { DIFFICULTY_RANGES } from '@/app/types'
import type { LCDifficulty } from '@/app/types'

type LCProblem = {
  titleSlug: string
  title: string
  difficulty: string
  acRate: number
  topicTags: { name: string; slug: string }[]
}

async function getLeetCodeProblemList(): Promise<LCProblem[]> {
  'use cache'
  cacheLife('hours')

  const lc = new LeetCode()
  const data = await lc.problems({ limit: 3000 })
  return data.questions as LCProblem[]
}

export type ListedProblem = {
  slug: string
  title: string
  difficulty: LCDifficulty
  tags: string[]
  acRate: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const diffKey = searchParams.get('difficulty')
  const limitParam = Number(searchParams.get('limit') ?? '60')
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 200)
    : 60

  let problems: LCProblem[]
  try {
    problems = await getLeetCodeProblemList()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[list-problems] Problem list fetch failed:', msg)
    return NextResponse.json(
      { error: `Could not fetch problem list: ${msg}` },
      { status: 502 }
    )
  }

  const range =
    diffKey && diffKey !== 'any'
      ? DIFFICULTY_RANGES.find((d) => d.key === diffKey)
      : null

  const filtered = range
    ? problems.filter((p) => {
        if (p.difficulty !== range.lcDifficulty) return false
        if (range.minAcRate !== undefined && p.acRate < range.minAcRate) return false
        if (range.maxAcRate !== undefined && p.acRate >= range.maxAcRate) return false
        return true
      })
    : problems

  const slim: ListedProblem[] = filtered.slice(0, limit).map((p) => ({
    slug: p.titleSlug,
    title: p.title,
    difficulty: p.difficulty as LCDifficulty,
    tags: p.topicTags.map((t) => t.name),
    acRate: p.acRate,
  }))

  return NextResponse.json({ problems: slim })
}
