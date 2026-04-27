import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const {
      result, answers, engagementId, invitationToken, instrument,
    } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const service = createServiceClient()

    const { data: resultRow, error } = await service
      .from('results')
      .insert({
        user_id:          user?.id ?? null,
        engagement_id:    engagementId ?? null,
        invitation_token: invitationToken ?? null,
        instrument:       instrument ?? 'RAPID',
        archetype:        result.archetype,
        confidence:       result.confidence,
        score_i:          result.scores?.I  ?? result.I  ?? 0,
        score_ch:         result.scores?.Ch ?? result.Ch ?? 0,
        score_co:         result.scores?.Co ?? result.Co ?? 0,
        score_im:         result.scores?.Im ?? result.Im ?? 0,
        // Full assessment indices — null for rapid classifier
        formation_score:  result.formationScore  ?? result.F  ?? null,
        alignment_index:  result.alignmentIndex  ?? result.A  ?? null,
        structural_index: result.structuralIndex ?? result.SI ?? null,
        shared_with_coach: false,
      })
      .select()
      .single()

    if (error) throw error

    // Save raw responses
    if (answers && resultRow) {
      const responseRows = Object.entries(answers).map(([itemId, value]) => ({
        result_id: resultRow.id,
        item_id:   parseInt(itemId),
        value:     value as number,
      }))
      if (responseRows.length > 0) {
        await service.from('responses').insert(responseRows)
      }
    }

    // Mark invitation completed
    if (invitationToken) {
      await service
        .from('invitations')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('token', invitationToken)
    }

    return NextResponse.json({ id: resultRow.id, success: true })
  } catch (err) {
    console.error('Result save error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
