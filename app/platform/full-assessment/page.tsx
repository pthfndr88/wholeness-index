'use client'
import { useState } from 'react'
import Link from 'next/link'
import FullClassifier from '@/components/FullClassifier'
import FullResultDisplay from '@/components/FullResultDisplay'
import type { FullAssessmentResult } from '@/lib/full-assessment'

export default function FullAssessmentPage() {
  const [result, setResult] = useState<FullAssessmentResult | null>(null)
  const [saving, setSaving] = useState(false)

  const handleComplete = async (r: FullAssessmentResult, answers: Record<number, number>) => {
    setResult(r)
    setSaving(true)
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: {
            archetype: r.archetype,
            confidence: r.confidence,
            scores: { I: r.I, Ch: r.Ch, Co: r.Co, Im: r.Im },
            formationScore: r.F,
            alignmentIndex: r.A,
            structuralIndex: r.SI,
          },
          answers,
          instrument: 'FULL',
        }),
      })
    } catch {}
    setSaving(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--ink-08)',
        backgroundColor: 'var(--cream-100)', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <Link href="/platform" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>←</span> Platform
        </Link>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Full Trapezium Assessment · 130 Items
        </div>
        {result && (
          <button onClick={() => { setResult(null) }} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.1em', background: 'none', border: 'none', cursor: 'pointer' }}>
            RETAKE
          </button>
        )}
      </header>

      {!result ? (
        <>
          {/* Intro */}
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 48px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
              Full Trapezium Assessment
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 42, color: 'var(--green-900)', fontWeight: 500, lineHeight: 1.1, marginBottom: 16 }}>
              88 items. Complete honesty. No performance.
            </h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink-70)', lineHeight: 1.65, marginBottom: 32 }}>
              This assessment takes 18–22 minutes. It is divided into five sections — Identity, Character, Competence, Impact, and Diagnostic — each measuring distinct sub-domains. You can complete one section at a time. Respond from present condition, not aspiration.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'left', marginBottom: 40 }}>
              {[
                { label: 'Items', value: "88" },
                { label: 'Sections', value: '5' },
                { label: 'Duration', value: '18–22 min' },
              ].map(stat => (
                <div key={stat.label} style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--green-900)', fontWeight: 500 }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-50)', marginBottom: 32 }}>
              Your results will include Formation Score (F), Alignment Index (A), Structural Integrity Index (SI), and a Composite Formation Score — the complete Trapezium Model output.
            </div>
          </div>
          <FullClassifier onComplete={handleComplete} />
        </>
      ) : (
        <div>
          {saving && (
            <div style={{ textAlign: 'center', padding: 16, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>
              SAVING RESULTS…
            </div>
          )}
          <FullResultDisplay result={result} showCoachingUpsell={true} />
        </div>
      )}
    </div>
  )
}
