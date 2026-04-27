import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: engagement } = await supabase
      .from('engagements')
      .select('*')
      .eq('id', id)
      .eq('coach_id', user.id)
      .single()

    if (!engagement) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: invitations } = await supabase
      .from('invitations')
      .select('*, results(archetype, confidence, shared_with_coach, score_i, score_ch, score_co, score_im)')
      .eq('engagement_id', id)
      .order('sent_at', { ascending: false })

    const { data: results } = await supabase
      .from('results')
      .select('archetype, confidence, shared_with_coach')
      .eq('engagement_id', id)

    const distribution: Record<string, number> = {}
    ;(results ?? []).filter(r => r.shared_with_coach).forEach(r => {
      distribution[r.archetype] = (distribution[r.archetype] ?? 0) + 1
    })

    return NextResponse.json({ engagement, invitations: invitations ?? [], distribution })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    await supabase.from('engagements').update({ active: false }).eq('id', id).eq('coach_id', user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
