'use client'
import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import Classifier from '@/components/Classifier'
import ResultDisplay from '@/components/ResultDisplay'
import type { ClassifierResult } from '@/lib/classifier'

interface Engagement { id: string; name: string; coachName: string; instrument: string }

export default function CohortTakePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [engagement, setEngagement] = useState<Engagement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [result, setResult] = useState<ClassifierResult | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/engagements/by-slug/${slug}`)
      .then(r => r.json())
      .then(d => d.error ? setError(true) : setEngagement(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  const handleComplete = async (r: ClassifierResult, answers: Record<number, number>) => {
    setResult(r)
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: r, answers, engagementId: engagement?.id, invitationToken: token }),
      })
      const data = await res.json()
      if (data.id) setResultId(data.id)
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConsentToShare = async () => {
    if (!resultId) return
    try { await fetch(`/api/results/${resultId}/share`, { method: 'POST' }) } catch {}
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream-100)' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.14em' }}>LOADING…</span>
    </div>
  )

  if (error || !engagement) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream-100)', padding: '24px' }}>
      <div style={{ maxWidth: 400, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--green-900)', fontWeight: 500, marginBottom: 12 }}>Assessment not found</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-50)', lineHeight: 1.6 }}>
          This link may have expired or been deactivated. Contact your coach for a new link.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      <header style={{ borderBottom: '1px solid var(--ink-08)', padding: '18px 48px', backgroundColor: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500, color: 'var(--green-900)', marginBottom: 2 }}>{engagement.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>
            WHOLENESS INDEX · FACILITATED BY {engagement.coachName.toUpperCase()}
          </div>
        </div>
      </header>
      <main>
        {!result ? (
          <div>
            <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 48px 0' }}>
              <div style={{ backgroundColor: 'var(--gold-50)', border: '1px solid var(--gold-200)', padding: '16px 20px', marginBottom: 8 }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--gold-700)', lineHeight: 1.6, margin: 0 }}>
                  You have been invited to complete the Wholeness Index as part of <strong>{engagement.name}</strong>.
                  Your result is private — you decide whether to share it with your coach once you see it.
                </p>
              </div>
            </div>
            <Classifier onComplete={handleComplete} />
          </div>
        ) : (
          <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px 48px 0' }}>
            <ResultDisplay
              result={result}
              showSharePrompt
              coachName={engagement.coachName}
              onConsentToShare={handleConsentToShare}
            />
          </div>
        )}
      </main>
    </div>
  )
}
