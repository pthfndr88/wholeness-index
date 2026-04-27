import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PlatformPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth?redirect=/platform')

  const { data: access } = await supabase
    .from('access')
    .select('product_type, granted_at')
    .eq('user_id', user.id)
    .order('granted_at', { ascending: false })

  const hasFullAssessment = access?.some(a =>
    ['full_assessment', 'coaching_bundle'].includes(a.product_type)
  )
  const hasCoaching = access?.some(a => a.product_type === 'coaching_bundle')

  if (!hasFullAssessment) redirect('/upgrade')

  const { data: latestResult } = await supabase
    .from('results')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 48px', borderBottom: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-100)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--gold-500)' }}>◆</span>
          <span style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 15, color: 'var(--green-900)' }}>Wholeness Index™</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>{user.email}</span>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '56px 48px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>Development platform</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 52px)', color: 'var(--green-900)', fontWeight: 500, lineHeight: 1.05, marginBottom: 8 }}>
          Your development pathway
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink-70)', marginBottom: 48, lineHeight: 1.6 }}>
          {hasCoaching ? 'Full assessment · Platform access · 3 coaching sessions' : 'Full assessment · Platform access'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Full assessment CTA */}
          <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--green-800)', padding: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
              {latestResult?.instrument === 'FULL' ? 'Full assessment complete' : 'Begin now'}
            </div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--green-900)', marginBottom: 12, fontWeight: 500 }}>
              Full Trapezium Assessment
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.6, marginBottom: 24 }}>
              130 items across all four domains. Produces your Formation Score, Alignment Index, and Structural Integrity Index.
            </p>
            {latestResult?.instrument === 'FULL' ? (
              <Link href="/platform/results" style={{ display: 'inline-block', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, padding: '12px 20px', borderRadius: 2, textDecoration: 'none' }}>
                View full results →
              </Link>
            ) : (
              <Link href="/take?instrument=full" style={{ display: 'inline-block', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, padding: '12px 20px', borderRadius: 2, textDecoration: 'none' }}>
                Begin full assessment →
              </Link>
            )}
          </div>

          {/* Development pathway */}
          <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
              Development pathway
            </div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--green-900)', marginBottom: 12, fontWeight: 500 }}>
              Your roadmap
            </h2>
            {latestResult ? (
              <>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.6, marginBottom: 20 }}>
                  Based on your <strong>{latestResult.archetype}</strong> profile. Your development focus: <strong>{latestResult.archetype === 'SEEK' ? 'Character activation' : latestResult.archetype === 'POW' ? 'Identity work' : latestResult.archetype === 'GEM' ? 'Visibility strategy' : latestResult.archetype === 'FRAG' ? 'Stabilisation first' : 'Multiplication and legacy'}</strong>.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['30-day focus', '90-day milestone', '6-month objective', '12-month vision'].map((label, i) => (
                    <div key={i} style={{ backgroundColor: 'var(--cream-100)', border: '1px solid var(--ink-08)', padding: '10px 14px' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-50)' }}>
                        {latestResult.instrument === 'FULL' ? 'Available after full assessment' : 'Complete full assessment to unlock'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-50)', lineHeight: 1.6 }}>
                Complete the full assessment to generate your personalised development pathway.
              </p>
            )}
          </div>
        </div>

        {/* Coaching upsell — only shown if no coaching purchased */}
        {!hasCoaching && latestResult && (
          <div style={{ backgroundColor: 'var(--gold-50)', border: '1px solid var(--gold-200)', padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>Add coaching</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--green-900)', marginBottom: 8, fontWeight: 500 }}>
                  3 sessions with a certified practitioner
                </h2>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.6, maxWidth: 480 }}>
                  A practitioner who has seen your full score breakdown can compress a 12-month development arc into 90 days. Sessions are scheduled after your full results.
                </p>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--green-900)', fontWeight: 500, marginBottom: 4 }}>£1,497</div>
                <Link href="/upgrade?product=coaching_bundle" style={{ display: 'inline-block', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, padding: '12px 20px', borderRadius: 2, textDecoration: 'none' }}>
                  Add coaching sessions →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
