import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data } = await supabase
      .from('engagements')
      .select(`*, invitations(status), results(shared_with_coach)`)
      .eq('coach_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { name, instrument, deadline } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`
    const service = createServiceClient()

    const { data, error } = await service
      .from('engagements')
      .insert({
        coach_id: user.id,
        name,
        slug,
        instrument: instrument === 'FULL' ? 'FULL' : 'RAPID',
        deadline: deadline || null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
