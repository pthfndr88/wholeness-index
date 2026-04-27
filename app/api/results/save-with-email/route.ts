import { sendRapidResultEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import type { ArchetypeKey } from '@/lib/classifier'

export async function POST(request: Request) {
  try {
    const { email, result } = await request.json()
    await sendRapidResultEmail(email, result.archetype as ArchetypeKey)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Result email error:', err)
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }
}
