'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ARCHETYPES } from '@/lib/archetypes'
import type { ClassifierResult } from '@/lib/classifier'
import TrapeziumDial from './TrapeziumDial'

interface Props {
  result: ClassifierResult
  showSharePrompt?: boolean
  coachName?: string
  onConsentToShare?: () => void
}

const DOMAIN_LABELS = ['Identity', 'Character', 'Competence', 'Impact']
const DOMAIN_COLORS = ['#1F3A32', '#3E6057', '#8C6E3E', '#B8955A']

export default function ResultDisplay({ result, showSharePrompt, coachName, onConsentToShare }: Props) {
  const [shared, setShared] = useState(false)
  const a = ARCHETYPES[result.archetype]
  const confPct = Math.round(result.confidence * 100)
  const domainScores: [number, number, number, number] = [
    result.scores.I, result.scores.Ch, result.scores.Co, result.scores.Im,
  ]
  const handleShare = () => { setShared(true); onConsentToShare?.() }

  const card = (children: React.ReactNode, extraStyle?: React.CSSProperties) => (
    <div className="result-section" style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28, ...extraStyle }}>
      {children}
    </div>
  )

  const eyebrow = (text: string) => (
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase' as const, marginBottom: 12 }}>
      {text}
    </div>
  )

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="result-header" style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: '36px 40px', marginBottom: 20 }}>
        {eyebrow('Your reading')}
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 1.05, fontWeight: 500, color: 'var(--green-900)', marginBottom: 10 }}>
          {a.name}
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--ink-70)', marginBottom: 16, lineHeight: 1.5 }}>
          {a.tagline}
        </p>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.12em' }}>
          Classification confidence: {confPct}%{result.confidence < 0.65 && ' · Full assessment recommended'}
        </div>
      </div>

      {/* Trapezium + meaning */}
      <div className="result-grid r-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {card(
          <div className="trapezium-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrapeziumDial scores={domainScores} size={300} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {card(<>
            {eyebrow('The reading')}
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.65, color: 'var(--ink-70)' }}>{a.meaning}</p>
          </>)}
          {card(<>
            {eyebrow('Domain scores')}
            {DOMAIN_LABELS.map((label, i) => (
              <div key={label} style={{ marginBottom: i < 3 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-70)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: DOMAIN_COLORS[i] }}>{Math.round(domainScores[i] * 100)}</span>
                </div>
                <div style={{ height: 3, backgroundColor: 'var(--ink-08)' }}>
                  <div style={{ height: '100%', backgroundColor: DOMAIN_COLORS[i], width: `${domainScores[i] * 100}%`, transition: 'width 700ms cubic-bezier(.2,.7,.2,1)' }} />
                </div>
              </div>
            ))}
          </>)}
        </div>
      </div>

      {/* Do / Don't */}
      <div className="r-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {card(<>
          {eyebrow('Do not')}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {a.donts.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, marginBottom: i < a.donts.length - 1 ? 10 : 0 }}>
                <span style={{ color: '#8C6E3E', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>✗</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.5 }}>{d}</span>
              </li>
            ))}
          </ul>
        </>)}
        {card(<>
          {eyebrow('Your first moves')}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {a.dos.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, marginBottom: i < a.dos.length - 1 ? 10 : 0 }}>
                <span style={{ color: 'var(--gold-600)', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.5 }}>{d}</span>
              </li>
            ))}
          </ul>
        </>)}
      </div>

      {/* Share prompt */}
      {showSharePrompt && !shared && (
        <div style={{ border: '1px solid var(--gold-200)', backgroundColor: 'var(--gold-50)', padding: 24, marginBottom: 16 }}>
          {eyebrow(`Share with ${coachName ?? 'your coach'}?`)}
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', marginBottom: 16 }}>
            Your result is private by default. Sharing allows your coach to provide personalised guidance.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={handleShare} style={{
              backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
              border: '1px solid var(--green-800)', borderRadius: 2,
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '12px 20px', cursor: 'pointer',
            }}>Share my result</button>
            <button style={{
              backgroundColor: 'transparent', color: 'var(--green-900)', border: '1px solid var(--ink-30)',
              borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '12px 20px', cursor: 'pointer',
            }}>Keep private</button>
          </div>
        </div>
      )}
      {shared && (
        <div style={{ border: '1px solid var(--green-100)', backgroundColor: 'var(--green-50)', padding: 16, marginBottom: 16 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#2d6a35' }}>✓ Your result has been shared with {coachName ?? 'your coach'}.</p>
        </div>
      )}

      {/* CTA */}
      <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28, textAlign: 'center' }}>
        {eyebrow('Go deeper')}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
          The full assessment produces your Formation Score, Alignment Index, and a 6–24 month development roadmap.
        </p>
        <Link href="/#full-assessment" style={{
          backgroundColor: 'var(--gold-500)', color: 'var(--green-900)',
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
          padding: '14px 24px', borderRadius: 2, textDecoration: 'none', display: 'inline-block',
        }}>
          Full Trapezium Assessment — £197
        </Link>
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', textAlign: 'center', marginTop: 20, letterSpacing: '0.08em' }}>
        PROVISIONAL CLASSIFICATION · WHOLENESS INDEX™ · PATHFINDER EDUCATIONAL LTD.
      </p>
    </div>
  )
}
