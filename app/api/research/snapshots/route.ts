import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — read latest snapshots for all archetypes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') ?? 'monthly'
    const archetype = searchParams.get('archetype')

    const service = createServiceClient()

    let query = service
      .from('archetype_snapshots')
      .select('*')
      .eq('period', period)
      .order('snapshot_date', { ascending: false })

    if (archetype) {
      query = query.eq('archetype', archetype)
    }

    // Get most recent snapshot per archetype
    const { data, error } = await query.limit(archetype ? 12 : 5)

    if (error) throw error

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('Snapshots error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// POST — trigger a fresh aggregation (super_admin only)
export async function POST(request: Request) {
  try {
    const { period = 'monthly', adminKey } = await request.json()

    // Simple admin key check — replace with proper role check post-launch
    if (adminKey !== process.env.RESEARCH_ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const service = createServiceClient()

    const { error } = await service.rpc('aggregate_archetype_snapshot', {
      p_period: period,
    })

    if (error) throw error

    return NextResponse.json({ success: true, period })
  } catch (err) {
    console.error('Aggregation error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
