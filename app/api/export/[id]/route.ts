import { createClient, createServiceClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/archetypes'
import type { ArchetypeKey } from '@/lib/classifier'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorised', { status: 401 })

    const { data: engagement } = await supabase
      .from('engagements').select('name').eq('id', id).eq('coach_id', user.id).single()
    if (!engagement) return new Response('Not found', { status: 404 })

    const service = createServiceClient()
    const { data: results } = await service
      .from('results').select('*').eq('engagement_id', id).eq('shared_with_coach', true)
    const { data: invitations } = await service
      .from('invitations').select('token, email').eq('engagement_id', id)

    const tokenToEmail = Object.fromEntries((invitations ?? []).map(i => [i.token, i.email]))
    const headers = ['Email','Archetype','Confidence %','Identity %','Character %','Competence %','Impact %','Completed At']
    const rows = (results ?? []).map(r => {
      const archName = ARCHETYPES[r.archetype?.toLowerCase() as ArchetypeKey]?.name ?? r.archetype
      return [tokenToEmail[r.invitation_token ?? ''] ?? r.user_id ?? 'anonymous', archName,
        Math.round(r.confidence*100), Math.round(r.score_i*100), Math.round(r.score_ch*100),
        Math.round(r.score_co*100), Math.round(r.score_im*100),
        new Date(r.completed_at).toLocaleDateString('en-GB')].join(',')
    })
    const csv = [headers.join(','), ...rows].join('\n')
    const filename = `${engagement.name.replace(/[^a-z0-9]/gi, '-')}-results.csv`
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="${filename}"` } })
  } catch {
    return new Response('Error', { status: 500 })
  }
}
