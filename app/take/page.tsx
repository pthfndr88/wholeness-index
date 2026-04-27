'use client'
import { useState } from 'react'
import Link from 'next/link'
import Classifier from '@/components/Classifier'
import ResultDisplay from '@/components/ResultDisplay'
import type { ClassifierResult } from '@/lib/classifier'

export default function TakePage() {
  const [result, setResult] = useState<ClassifierResult | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleComplete = async (r: ClassifierResult, answers: Record<number, number>) => {
    setResult(r)
    try {
      const res = await fetch('/api/results', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: r, answers }),
      })
      const data = await res.json()
      if (data.id) setResultId(data.id)
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!email || !result) return
    setSaving(true)
    try {
      await fetch('/api/results/save-with-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, result }),
      })
      setSaved(true)
    } catch {}
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 48px', borderBottom: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-100)', position: 'sticky', top: 0, zIndex: 20 }}>
        <Link href="/" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>←</span> Wholeness Index
        </Link>
        {result && (
          <button onClick={() => { setResult(null); setEmail(''); setSaved(false); setResultId(null) }} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.1em', background: 'none', border: 'none', cursor: 'pointer' }}>
            RETAKE
          </button>
        )}
      </header>

      <main>
        {!result ? (
          <Classifier onComplete={handleComplete} />
        ) : (
          <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px 48px 0' }}>
            <ResultDisplay result={result} />

            {/* Email capture */}
            {!saved ? (
              <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28, marginTop: 20 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Save your result
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', marginBottom: 16, lineHeight: 1.5 }}>
                  Enter your email to receive your result and development guide. Also unlocks your upgrade link.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    style={{ flex: 1, padding: '14px 16px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-50)', borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)', outline: 'none' }} />
                  <button onClick={handleSave} disabled={!email || saving} style={{
                    backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', border: '1px solid var(--green-800)', borderRadius: 2,
                    fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, padding: '14px 22px',
                    cursor: email ? 'pointer' : 'not-allowed', opacity: email ? 1 : 0.5,
                  }}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(26,22,20,0.08)', backgroundColor: 'var(--green-50)', padding: 20, marginTop: 20 }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#1F3A32' }}>✓ Result saved and emailed.</p>
              </div>
            )}

            {/* Upgrade prompt */}
            <div style={{ border: '1px solid var(--gold-200)', backgroundColor: 'var(--gold-50)', padding: 32, marginTop: 20, marginBottom: 48, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
                Want the full picture?
              </div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--green-900)', fontWeight: 500, marginBottom: 12, lineHeight: 1.1 }}>
                This is a rapid reading.<br />
                <span style={{ fontStyle: 'italic' }}>The full assessment goes much deeper.</span>
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-70)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
                130 items · Formation Score · Alignment Index · 6–24 month development roadmap
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href={`/upgrade${resultId ? `?resultId=${resultId}` : ''}`} style={{
                  display: 'inline-block', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
                  fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, padding: '14px 24px', borderRadius: 2, textDecoration: 'none',
                }}>
                  Unlock full assessment — £197
                </Link>
              </div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold-700)', letterSpacing: '0.1em', marginTop: 12 }}>
                HAVE A DISCOUNT CODE? ENTER AT CHECKOUT
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
