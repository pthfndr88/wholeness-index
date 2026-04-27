import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Verify the result belongs to this user OR has an invitation token
    const { data: result } = await supabase
      .from('results')
      .select('id, user_id, invitation_token')
      .eq('id', id)
      .single()

    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Allow if: result belongs to signed-in user, OR result has an invitation token (anonymous participant)
    const isOwner = user && result.user_id === user.id
    const isInvited = !!result.invitation_token

    if (!isOwner && !isInvited) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const service = createServiceClient()
    await service.from('results').update({ shared_with_coach: true }).eq('id', id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
