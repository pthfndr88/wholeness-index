import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type EngagementWithCoach = {
  id: string
  name: string
  slug: string
  instrument: string
  profiles: { full_name: string | null } | null
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const service = createServiceClient()
    const { data } = await service
      .from('engagements')
      .select('id, name, slug, instrument, profiles!coach_id(full_name)')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const engagement = data as unknown as EngagementWithCoach

    return NextResponse.json({
      id: engagement.id,
      name: engagement.name,
      slug: engagement.slug,
      instrument: engagement.instrument,
      coachName: engagement.profiles?.full_name ?? 'Your coach',
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
