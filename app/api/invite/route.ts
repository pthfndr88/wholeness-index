import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendInvitationEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

type EngagementInviteContext = {
  id: string
  name: string
  slug: string
  profiles: { full_name: string | null } | null
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { engagementId, emails } = await request.json()
    if (!engagementId || !emails?.length) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const service = createServiceClient()

    const { data: engagement } = await service
      .from('engagements')
      .select('id, name, slug, profiles!coach_id(full_name)')
      .eq('id', engagementId)
      .eq('coach_id', user.id)
      .single()

    if (!engagement) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const engagementData = engagement as unknown as EngagementInviteContext

    const coachName = engagementData.profiles?.full_name ?? 'Your coach'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    const results = await Promise.allSettled(
      (emails as string[]).map(async (email: string) => {
        const { data: invite } = await service
          .from('invitations')
          .insert({ engagement_id: engagementId, email })
          .select()
          .single()

        const assessmentUrl = `${appUrl}/take/${engagementData.slug}?token=${invite!.token}`
        await sendInvitationEmail(email, {
          engagementName: engagementData.name,
          coachName,
          assessmentUrl,
        })
        return { email }
      })
    )

    return NextResponse.json({
      succeeded: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      total: emails.length,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
