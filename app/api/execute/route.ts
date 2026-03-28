import { NextResponse } from 'next/server'
import { LANGUAGES } from '@/app/types'
import type { LanguageKey } from '@/app/types'

// Official Judge0 CE public instance — no auth required, rate-limited
const JUDGE0_BASE = 'https://ce.judge0.com'

export type ExecuteResult = {
  output: string
  status: string
  statusId: number
  time: string | null
}

export async function POST(request: Request) {
  const { codigo, lenguaje } = await request.json() as { codigo: string; lenguaje: LanguageKey }

  const lang = LANGUAGES.find((l) => l.key === lenguaje)
  if (!lang) {
    return NextResponse.json({ error: `Unknown language: ${lenguaje}` }, { status: 400 })
  }

  const sourceB64 = Buffer.from(codigo).toString('base64')

  // 1 — Submit
  const submitRes = await fetch(`${JUDGE0_BASE}/submissions?base64_encoded=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: sourceB64,
      language_id: lang.judge0Id,
      stdin: '',
    }),
  })

  if (!submitRes.ok) {
    const text = await submitRes.text()
    console.error('[execute] Submit failed:', submitRes.status, text)
    return NextResponse.json({ error: `Execution service error: ${submitRes.status}` }, { status: 502 })
  }

  const { token } = await submitRes.json() as { token: string }

  // 2 — Poll until terminal status (id >= 3)
  let result = null
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 1000))

    const pollRes = await fetch(
      `${JUDGE0_BASE}/submissions/${token}?base64_encoded=true`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!pollRes.ok) continue

    const data = await pollRes.json()
    if (data.status?.id >= 3) {
      result = data
      break
    }
  }

  if (!result) {
    return NextResponse.json({ error: 'Execution timed out' }, { status: 504 })
  }

  const decode = (val: string | null) =>
    val ? Buffer.from(val, 'base64').toString('utf-8') : ''

  const stdout = decode(result.stdout)
  const stderr = decode(result.stderr)
  const compileOutput = decode(result.compile_output)

  const output = stdout || stderr || compileOutput || '(no output)'

  const response: ExecuteResult = {
    output,
    status: result.status?.description ?? 'Unknown',
    statusId: result.status?.id ?? 0,
    time: result.time ?? null,
  }

  return NextResponse.json(response)
}
