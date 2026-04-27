'use client'
import { useState, useCallback } from 'react'
import {
  FULL_ASSESSMENT_ITEMS,
  FULL_ASSESSMENT_SECTIONS,
  scoreFullAssessment,
  getItemsBySection,
  type FullAssessmentResult,
} from '@/lib/full-assessment'

interface Props {
  onComplete: (result: FullAssessmentResult, answers: Record<number, number>) => void
}

const DOMAIN_COLORS: Record<string, { bg: string; fg: string }> = {
  I:  { bg: '#E4ECEB', fg: '#1F3A32' },
  Ch: { bg: '#EFE2C8', fg: '#8C6E3E' },
  Co: { bg: '#F3DFC8', fg: '#A86A2E' },
  Im: { bg: '#E9DDEF', fg: '#6A4A7A' },
  Dx: { bg: '#E6E4E0', fg: '#5A544E' },
}

const SCALE = ['Rarely true', 'Sometimes', 'Often true', 'Usually true', 'This is me']

export default function FullClassifier({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [currentSection, setCurrentSection] = useState(0)

  const section = FULL_ASSESSMENT_SECTIONS[currentSection]
  const sectionItems = getItemsBySection(section.key)
  const totalAnswered = Object.keys(answers).length
  const sectionAnswered = sectionItems.filter(i => answers[i.id] !== undefined).length
  const sectionComplete = sectionAnswered === sectionItems.length
  const allComplete = totalAnswered === FULL_ASSESSMENT_ITEMS.length
  const progress = Math.round((totalAnswered / FULL_ASSESSMENT_ITEMS.length) * 100)

  const handleSelect = useCallback((itemId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }))
  }, [])

  const nextSection = () => {
    if (currentSection < FULL_ASSESSMENT_SECTIONS.length - 1) {
      setCurrentSection(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onComplete(scoreFullAssessment(answers), answers)
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 48px 96px' }}>
      {/* Global progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--gold-700)', textTransform: 'uppercase' }}>
          Full Trapezium Assessment
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)' }}>{totalAnswered} / {FULL_ASSESSMENT_ITEMS.length}</div>
      </div>
      <div style={{ height: 2, backgroundColor: 'var(--ink-08)', marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', backgroundColor: 'var(--gold-500)', width: `${progress}%`, transition: 'width 360ms cubic-bezier(.2,.7,.2,1)' }} />
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 40, flexWrap: 'wrap' }}>
        {FULL_ASSESSMENT_SECTIONS.map((s, i) => {
          const items = getItemsBySection(s.key)
          const done = items.every(item => answers[item.id] !== undefined)
          const active = i === currentSection
          return (
            <button key={s.key} onClick={() => setCurrentSection(i)} style={{
              padding: '6px 14px', borderRadius: 2,
              border: active ? '1px solid var(--green-800)' : '1px solid var(--ink-15)',
              backgroundColor: done ? 'var(--green-50)' : active ? 'var(--green-800)' : 'transparent',
              color: active ? 'var(--cream-50)' : done ? 'var(--green-800)' : 'var(--ink-70)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 140ms',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {done && <span>✓</span>}
              {s.label}
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, opacity: 0.7 }}>{s.items}</span>
            </button>
          )
        })}
      </div>

      {/* Section header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, marginBottom: 10, fontSize: 12, fontWeight: 500, ...DOMAIN_COLORS[section.domain] }}>
          {section.label}
        </div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--green-900)', fontWeight: 500, marginBottom: 8, lineHeight: 1.2 }}>
          {section.description}
        </h2>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>
          {sectionAnswered} of {sectionItems.length} answered in this section
        </div>
      </div>

      {/* Scale header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 332px', paddingBottom: 14, marginBottom: 8, borderBottom: '1px solid var(--ink-08)' }}>
        <div />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 44px)', gap: 24 }}>
          {SCALE.map((l, i) => (
            <div key={i} style={{ fontSize: 10, color: 'var(--ink-50)', textAlign: 'center', lineHeight: 1.2 }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Items */}
      {sectionItems.map((item, idx) => {
        const selected = answers[item.id]
        return (
          <div key={item.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 332px', gap: 48,
            padding: '26px 0',
            borderBottom: idx < sectionItems.length - 1 ? '1px solid var(--ink-08)' : 'none',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.14em', marginBottom: 8 }}>
                {String(item.id).padStart(3, '0')}
              </div>
              <div style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.55, color: 'var(--green-900)', fontFamily: 'var(--sans)', marginBottom: 10 }}>
                {item.text}
              </div>
              {item.reversed && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-30)', letterSpacing: '0.1em' }}>REVERSE-SCORED</span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 44px)', gap: 24 }}>
              {[1, 2, 3, 4, 5].map(value => (
                <button key={value} onClick={() => handleSelect(item.id, value)} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: selected === value ? '1.5px solid var(--green-800)' : '1px solid var(--ink-15)',
                  backgroundColor: selected === value ? 'var(--green-800)' : 'var(--cream-50)',
                  color: selected === value ? 'var(--cream-50)' : 'var(--ink-50)',
                  fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 140ms',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {value}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Section navigation */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--ink-08)', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-50)' }}>
          {sectionComplete
            ? `Section complete ✓`
            : `${sectionItems.length - sectionAnswered} remaining in this section`
          }
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {currentSection > 0 && (
            <button onClick={() => { setCurrentSection(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{
              backgroundColor: 'transparent', color: 'var(--green-900)', border: '1px solid var(--ink-30)',
              borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
              padding: '14px 20px', cursor: 'pointer',
            }}>
              ← Previous
            </button>
          )}
          <button onClick={nextSection} disabled={!sectionComplete} style={{
            backgroundColor: sectionComplete ? 'var(--green-800)' : 'var(--cream-50)',
            color: sectionComplete ? 'var(--cream-50)' : 'var(--ink-30)',
            border: sectionComplete ? '1px solid var(--green-800)' : '1px solid var(--ink-15)',
            borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
            padding: '14px 24px', cursor: sectionComplete ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 10, transition: 'all 160ms',
          }}>
            {currentSection === FULL_ASSESSMENT_SECTIONS.length - 1
              ? allComplete ? 'See my full results →' : 'Complete all sections to finish'
              : `Next: ${FULL_ASSESSMENT_SECTIONS[currentSection + 1]?.label} →`
            }
          </button>
        </div>
      </div>
    </div>
  )
}
