'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Engagement {
  id: string; name: string; slug: string; instrument: string
  deadline: string | null; active: boolean; createdAt: string
  invitedCount: number; completedCount: number; sharedCount: number
}

export default function CoachDashboard() {
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/engagements').then(r => r.json()).then(d => setEngagements(d ?? [])).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.14em' }}>LOADING…</span>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>
            Practitioner portal
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 42, color: 'var(--green-900)', lineHeight: 1.1 }}>Engagements</h1>
        </div>
        <Link href="/coach/new" style={{
          backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
          padding: '12px 20px', borderRadius: 2, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          New engagement <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>→</span>
        </Link>
      </div>

      {engagements.length === 0 ? (
        <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: '80px 48px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--green-900)', marginBottom: 12 }}>
            No engagements yet
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-50)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
            Create your first engagement to deploy the Wholeness Index to a client cohort.
          </p>
          <Link href="/coach/new" style={{
            backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
            padding: '14px 22px', borderRadius: 2, textDecoration: 'none', display: 'inline-block',
          }}>
            Create first engagement
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px',
            padding: '8px 24px', gap: 16,
          }}>
            {['Engagement', 'Invited', 'Completed', 'Rate', 'Shared'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-50)', textTransform: 'uppercase', textAlign: h === 'Engagement' ? 'left' : 'right' }}>
                {h}
              </div>
            ))}
          </div>

          {engagements.map(e => {
            const rate = e.invitedCount > 0 ? Math.round((e.completedCount / e.invitedCount) * 100) : 0
            return (
              <Link key={e.id} href={`/coach/engagement/${e.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)',
                  padding: '20px 24px', transition: 'border-color 140ms', cursor: 'pointer',
                  display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px', gap: 16, alignItems: 'center',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--green-900)', fontWeight: 500 }}>{e.name}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--gold-700)', padding: '3px 8px', border: '1px solid var(--gold-200)' }}>
                        {e.instrument}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.08em' }}>
                      {formatDate(e.createdAt)}
                      {e.deadline && ` · Due ${formatDate(e.deadline)}`}
                    </div>
                    {e.invitedCount > 0 && (
                      <div style={{ marginTop: 8, height: 2, backgroundColor: 'var(--ink-08)', maxWidth: 240 }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--gold-500)', width: `${rate}%`, transition: 'width 500ms' }} />
                      </div>
                    )}
                  </div>
                  {[e.invitedCount, e.completedCount, e.invitedCount > 0 ? `${rate}%` : '—', e.sharedCount].map((v, i) => (
                    <div key={i} style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--green-900)', textAlign: 'right', fontWeight: 500 }}>
                      {v}
                    </div>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
