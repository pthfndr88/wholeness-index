'use client'
import { useState, useCallback } from 'react'
import { CLASSIFIER_ITEMS, classify, type ClassifierResult } from '@/lib/classifier'

interface ClassifierProps {
  onComplete: (result: ClassifierResult, answers: Record<number, number>) => void
}

const DOMAIN_COLORS: Record<string, { bg: string; fg: string }> = {
  I:  { bg: '#E4ECEB', fg: '#1F3A32' },
  Ch: { bg: '#EFE2C8', fg: '#8C6E3E' },
  Co: { bg: '#F3DFC8', fg: '#A86A2E' },
  Im: { bg: '#E9DDEF', fg: '#6A4A7A' },
  Dx: { bg: '#E6E4E0', fg: '#5A544E' },
}

const DOMAIN_NAMES: Record<string, string> = {
  I: 'Identity', Ch: 'Character', Co: 'Competence', Im: 'Impact', Dx: 'Discriminator',
}

const SCALE = ['Rarely true', 'Sometimes', 'Often true', 'Usually true', 'This is me']

export default function Classifier({ onComplete }: ClassifierProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const answered = Object.keys(answers).length
  const allAnswered = answered === CLASSIFIER_ITEMS.length

  const handleSelect = useCallback((itemId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }))
    setTimeout(() => {
      const next = document.querySelector(`[data-item='${itemId + 1}']`) as HTMLElement
      if (next) {
        const y = next.getBoundingClientRect().top + window.scrollY - 120
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 260)
  }, [])

  const handleSubmit = () => {
    if (!allAnswered) return
    onComplete(classify(answers), answers)
  }

  return (
    <div className="page-enter assessment-pad" style={{ maxWidth: 920, margin: '0 auto', padding: '40px 48px 96px' }}>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--gold-700)', textTransform: 'uppercase' }}>
          SAE Rapid Classifier · v1.0
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-50)' }}>
          {answered} of {CLASSIFIER_ITEMS.length}
        </div>
      </div>

      <div style={{ height: 2, backgroundColor: 'var(--ink-08)', marginBottom: 40, overflow: 'hidden' }}>
        <div style={{
          height: '100%', backgroundColor: 'var(--gold-500)',
          width: `${(answered / CLASSIFIER_ITEMS.length) * 100}%`,
          transition: 'width 360ms cubic-bezier(.2,.7,.2,1)',
        }} />
      </div>

      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.15, marginBottom: 12, color: 'var(--green-900)' }}>
        Fifteen statements. No correct answer.
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-70)', maxWidth: 620, marginBottom: 40, fontFamily: 'var(--sans)' }}>
        Respond from present condition, not aspiration. Precision serves you; performance does not.
      </p>

      {/* Scale header — desktop only */}
      <div className="scale-header" style={{
        display: 'grid', gridTemplateColumns: '1fr 332px',
        paddingBottom: 16, marginBottom: 8, borderBottom: '1px solid var(--ink-08)',
      }}>
        <div />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 44px)', gap: 24 }}>
          {SCALE.map((l, i) => (
            <div key={i} style={{ fontSize: 10, color: 'var(--ink-50)', textAlign: 'center', lineHeight: 1.2 }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Statements */}
      <div>
        {CLASSIFIER_ITEMS.map((item, idx) => {
          const dc = DOMAIN_COLORS[item.domain] ?? DOMAIN_COLORS.Dx
          const selected = answers[item.id]
          return (
            <div key={item.id} data-item={item.id} className="statement-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 332px', gap: 48,
              padding: '28px 0',
              borderBottom: idx < CLASSIFIER_ITEMS.length - 1 ? '1px solid var(--ink-08)' : 'none',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.14em', marginBottom: 10 }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.5, color: 'var(--green-900)', marginBottom: 12, fontFamily: 'var(--sans)' }}>
                  {item.text}
                </div>
                <span style={{ display: 'inline-block', background: dc.bg, color: dc.fg, padding: '4px 11px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                  {DOMAIN_NAMES[item.domain] ?? 'Discriminator'}
                </span>
              </div>

              {/* Scale labels above buttons on mobile */}
              <div>
                <div className="likert-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 44px)', gap: 24 }}>
                  {[1, 2, 3, 4, 5].map(value => (
                    <button key={value} onClick={() => handleSelect(item.id, value)} className="likert-btn" style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: selected === value ? '1.5px solid var(--green-800)' : '1px solid var(--ink-15)',
                      backgroundColor: selected === value ? 'var(--green-800)' : 'var(--cream-50)',
                      color: selected === value ? 'var(--cream-50)' : 'var(--ink-50)',
                      fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 140ms ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {value}
                    </button>
                  ))}
                </div>
                {/* Mobile scale labels */}
                <div className="r-show-mobile" style={{ display: 'none', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 6 }}>
                  {SCALE.map((l, i) => (
                    <div key={i} style={{ fontSize: 9, color: 'var(--ink-50)', textAlign: 'center', lineHeight: 1.2, fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit */}
      <div style={{ marginTop: 48, position: 'sticky', bottom: 0, backgroundColor: 'var(--cream-100)', paddingBottom: 24, paddingTop: 16 }}>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-50)', marginBottom: 12, fontFamily: 'var(--sans)' }}>
          {allAnswered ? 'All statements answered.' : `${CLASSIFIER_ITEMS.length - answered} remaining`}
        </div>
        <button onClick={handleSubmit} disabled={!allAnswered} style={{
          width: '100%', padding: '18px 24px', fontSize: 15,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
          backgroundColor: allAnswered ? 'var(--green-800)' : 'var(--cream-50)',
          color: allAnswered ? 'var(--cream-50)' : 'var(--ink-50)',
          border: allAnswered ? '1px solid var(--green-800)' : '1px solid var(--ink-15)',
          borderRadius: 2, cursor: allAnswered ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--sans)', fontWeight: 500, transition: 'all 160ms',
        }}>
          {allAnswered
            ? <><span>See my reading</span><span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>→</span></>
            : 'Complete all statements to continue'
          }
        </button>
      </div>
    </div>
  )
}
