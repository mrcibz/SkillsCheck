import { NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'
import { LeetCode, Credential } from 'leetcode-query'
import { DIFFICULTY_RANGES } from '@/app/types'
import type { Problema, LCDifficulty } from '@/app/types'

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

export async function GET(request: Request) {
  if (!process.env.LEETCODE_SESSION) {
    return NextResponse.json(
      { error: 'LEETCODE_SESSION not configured in .env.local' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const diffKey = searchParams.get('difficulty') ?? 'warmup'
  const isAny = diffKey === 'any'
  const range = isAny
    ? null
    : DIFFICULTY_RANGES.find((d) => d.key === diffKey) ?? DIFFICULTY_RANGES[0]

  let problems: LCProblem[]
  try {
    problems = await getLeetCodeProblemList()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[get-problem] Problem list fetch failed:', msg)
    return NextResponse.json(
      { error: `Could not fetch problem list: ${msg}` },
      { status: 502 }
    )
  }

  const filtered = range
    ? problems.filter((p) => {
        if (p.difficulty !== range.lcDifficulty) return false
        if (range.minAcRate !== undefined && p.acRate < range.minAcRate) return false
        if (range.maxAcRate !== undefined && p.acRate >= range.maxAcRate) return false
        return true
      })
    : problems

  if (filtered.length === 0) {
    return NextResponse.json(
      { error: 'No problems found for this difficulty range' },
      { status: 404 }
    )
  }

  const problem = filtered[Math.floor(Math.random() * filtered.length)]

  // Fetch full HTML content (requires session auth)
  let content: string | null = null
  try {
    const credential = new Credential()
    await credential.init(process.env.LEETCODE_SESSION)
    const lc = new LeetCode(credential)
    const detail = await lc.problem(problem.titleSlug)
    content = detail.content ?? null
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[get-problem] Content fetch failed:', msg)
    // Non-fatal: return problem without content
  }

  const resultado: Problema = {
    title: problem.title,
    difficulty: problem.difficulty as LCDifficulty,
    tags: problem.topicTags.map((t) => t.name),
    slug: problem.titleSlug,
    url: `https://leetcode.com/problems/${problem.titleSlug}/`,
    content,
  }

  return NextResponse.json(resultado)
}
