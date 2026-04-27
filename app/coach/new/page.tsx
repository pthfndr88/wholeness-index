'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewEngagementPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [instrument, setInstrument] = useState('RAPID')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    try {
      const res = await fetch('/api/engagements', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, instrument, deadline: deadline || null }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      router.push(`/coach/engagement/${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create engagement')
      setLoading(false)
    }
  }

  const labelStyle = {
    display: 'block', fontFamily: 'var(--mono)', fontSize: 10,
    letterSpacing: '0.14em', color: 'var(--ink-50)', textTransform: 'uppercase' as const, marginBottom: 10,
  }

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <Link href="/coach" style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-50)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>←</span> Engagements
        </Link>
      </div>

      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>
        New engagement
      </div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 42, color: 'var(--green-900)', marginBottom: 8, lineHeight: 1.1 }}>
        Deploy the Index
      </h1>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-50)', marginBottom: 48 }}>
        Create a named cohort deployment. You&apos;ll receive a unique assessment link.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 40 }}>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Engagement name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Apex Partners — Senior Leadership Cohort" required
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-50)', borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)', outline: 'none' }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-50)', letterSpacing: '0.08em', marginTop: 8 }}>
              This name appears in participant invitation emails
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Instrument</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { val: 'RAPID', label: 'Rapid Classifier', sub: '15 items · 8 minutes' },
                { val: 'FULL',  label: 'Full Assessment',  sub: '130 items · 25–35 minutes' },
              ].map(opt => (
                <button key={opt.val} type="button" onClick={() => setInstrument(opt.val)} style={{
                  padding: 18, border: instrument === opt.val ? '1px solid var(--green-800)' : '1px solid var(--ink-15)',
                  backgroundColor: instrument === opt.val ? 'var(--green-50)' : 'var(--cream-50)',
                  borderRadius: 2, textAlign: 'left', cursor: 'pointer', transition: 'all 140ms',
                }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--green-900)', marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold-700)', letterSpacing: '0.08em' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <label style={labelStyle}>Deadline <span style={{ color: 'var(--ink-30)' }}>(optional)</span></label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-50)', borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)', outline: 'none' }} />
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--gold-50)', border: '1px solid var(--gold-200)', padding: '12px 16px', marginBottom: 20, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--gold-700)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={loading || !name} style={{
              flex: 1, backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
              border: '1px solid var(--green-800)', borderRadius: 2,
              fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
              padding: '16px 22px', cursor: loading || !name ? 'not-allowed' : 'pointer',
              opacity: loading || !name ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {loading ? 'Creating…' : <><span>Create engagement</span><span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>→</span></>}
            </button>
            <Link href="/coach" style={{
              backgroundColor: 'transparent', color: 'var(--green-900)', border: '1px solid var(--ink-30)',
              fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
              padding: '16px 20px', borderRadius: 2, textDecoration: 'none', display: 'flex', alignItems: 'center',
            }}>
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
