import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const {
      resultId, sector, roleLevel, yearsExperience,
      country, region, orgSize, consent,
    } = await request.json()

    // Consent is required — never store without it
    if (!consent) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    }

    if (!resultId) {
      return NextResponse.json({ error: 'Result ID required' }, { status: 400 })
    }

    const service = createServiceClient()

    const { error } = await service.from('research_tags').insert({
      result_id:        resultId,
      user_id:          user?.id ?? null,
      sector:           sector ?? null,
      role_level:       roleLevel ?? null,
      years_experience: yearsExperience ?? null,
      country:          country ?? null,
      region:           region ?? null,
      org_size:         orgSize ?? null,
      consent_given:    true,
      consent_at:       new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Research tags error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
