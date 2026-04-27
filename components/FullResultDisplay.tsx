'use client'
import Link from 'next/link'
import { ARCHETYPES } from '@/lib/archetypes'
import type { FullAssessmentResult } from '@/lib/full-assessment'
import TrapeziumDial from './TrapeziumDial'

interface Props {
  result: FullAssessmentResult
  showCoachingUpsell?: boolean
}

const DOMAIN_LABELS = ['Identity', 'Character', 'Competence', 'Impact']
const DOMAIN_COLORS = ['#1F3A32', '#3E6057', '#8C6E3E', '#B8955A']
const DOMAIN_KEYS = ['I', 'Ch', 'Co', 'Im'] as const

const SUB_DOMAIN_LABELS: Record<string, string> = {
  I_selfconcept: 'Self-concept', I_purpose: 'Purpose', I_belief: 'Belief alignment', I_values: 'Values', I_narrative: 'Narrative',
  Ch_consistency: 'Consistency', Ch_ethics: 'Ethics', Ch_discipline: 'Discipline', Ch_courage: 'Courage', Ch_integrity: 'Integrity',
  Co_skills: 'Skills', Co_application: 'Application', Co_problemsolving: 'Problem-solving', Co_learning: 'Learning', Co_execution: 'Execution',
  Im_recognition: 'Recognition', Im_opportunity: 'Opportunity', Im_influence: 'Influence', Im_contribution: 'Contribution', Im_legacy: 'Legacy',
}

function IndexCard({ label, value, description }: { label: string; value: number; description: string }) {
  const pct = Math.round(value * 1000) / 10
  return (
    <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 24 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--green-900)', fontWeight: 500, marginBottom: 4 }}>
        {value.toFixed(3)}
      </div>
      <div style={{ height: 2, backgroundColor: 'var(--ink-08)', marginBottom: 8 }}>
        <div style={{ height: '100%', backgroundColor: 'var(--gold-500)', width: `${pct}%`, transition: 'width 700ms' }} />
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-50)', lineHeight: 1.5 }}>{description}</div>
    </div>
  )
}

export default function FullResultDisplay({ result, showCoachingUpsell }: Props) {
  const a = ARCHETYPES[result.archetype as keyof typeof ARCHETYPES]
  const domainScores: [number, number, number, number] = [result.I, result.Ch, result.Co, result.Im]

  const subdomainsByDomain: Record<string, string[]> = {
    I:  ['I_selfconcept', 'I_purpose', 'I_belief', 'I_values', 'I_narrative'],
    Ch: ['Ch_consistency', 'Ch_ethics', 'Ch_discipline', 'Ch_courage', 'Ch_integrity'],
    Co: ['Co_skills', 'Co_application', 'Co_problemsolving', 'Co_learning', 'Co_execution'],
    Im: ['Im_recognition', 'Im_opportunity', 'Im_influence', 'Im_contribution', 'Im_legacy'],
  }

  return (
    <div className="page-enter" style={{ maxWidth: 960, margin: '0 auto', padding: '48px 48px 80px' }}>

      {/* Header */}
      <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: '40px 48px', marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
          Full Trapezium Assessment — Complete
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 6vw, 72px)', color: 'var(--green-900)', fontWeight: 500, lineHeight: 1.05, marginBottom: 8 }}>
          {a.name}
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-70)', marginBottom: 20, lineHeight: 1.5 }}>{a.tagline}</p>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.12em' }}>
          Classification confidence: {Math.round(result.confidence * 100)}% · Full 130-item instrument
        </div>
      </div>

      {/* Three indices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <IndexCard label="Formation Index" value={result.F}
          description="Wholeness — the integration of all four domains weighted by their structural importance." />
        <IndexCard label="Alignment Index" value={result.A}
          description="Balance — how proportionally your four domains develop relative to each other." />
        <IndexCard label="Structural Integrity" value={result.SI}
          description="Strength — the product of the foundational pairing (Identity × Impact) and the enabling pairing (Character × Competence)." />
      </div>

      {/* CFS */}
      <div style={{ border: '1px solid var(--gold-200)', backgroundColor: 'var(--gold-50)', padding: 24, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>
          Composite Formation Score
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 56, color: 'var(--green-900)', fontWeight: 500, lineHeight: 1 }}>
          {result.CFS.toFixed(4)}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold-700)', letterSpacing: '0.1em', marginTop: 8 }}>
          F × A × SI = {result.F.toFixed(3)} × {result.A.toFixed(3)} × {result.SI.toFixed(3)}
        </div>
      </div>

      {/* Trapezium + domain scores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrapeziumDial scores={domainScores} size={320} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Domain scores */}
          <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 24 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 16 }}>Domain scores</div>
            {DOMAIN_LABELS.map((label, i) => {
              const key = DOMAIN_KEYS[i]
              const score = result[key]
              return (
                <div key={label} style={{ marginBottom: i < 3 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: DOMAIN_COLORS[i] }}>{Math.round(score * 100)}</span>
                  </div>
                  <div style={{ height: 3, backgroundColor: 'var(--ink-08)' }}>
                    <div style={{ height: '100%', backgroundColor: DOMAIN_COLORS[i], width: `${score * 100}%`, transition: 'width 700ms' }} />
                  </div>
                </div>
              )
            })}
          </div>
          {/* Reading */}
          <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 24, flex: 1 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 10 }}>The reading</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.65 }}>{a.meaning}</p>
          </div>
        </div>
      </div>

      {/* Sub-domain scores */}
      <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 20 }}>
          Sub-domain analysis
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          {DOMAIN_KEYS.map((dk, di) => (
            <div key={dk}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, color: DOMAIN_COLORS[di], marginBottom: 12 }}>{DOMAIN_LABELS[di]}</div>
              {subdomainsByDomain[dk].map(sd => {
                const score = result.subdomains[sd as keyof typeof result.subdomains]
                return (
                  <div key={sd} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-70)' }}>{SUB_DOMAIN_LABELS[sd]}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: DOMAIN_COLORS[di] }}>{Math.round(score * 100)}</span>
                    </div>
                    <div style={{ height: 2, backgroundColor: 'var(--ink-08)' }}>
                      <div style={{ height: '100%', backgroundColor: DOMAIN_COLORS[di], width: `${score * 100}%`, opacity: 0.7, transition: 'width 600ms' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Do/Don't */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: '#8C6E3E', textTransform: 'uppercase', marginBottom: 14 }}>Do not</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {a.donts.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ color: '#8C6E3E', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>✗</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.5 }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: '#1F3A32', textTransform: 'uppercase', marginBottom: 14 }}>Your first moves</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {a.dos.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ color: 'var(--gold-600)', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.5 }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Coaching upsell */}
      {showCoachingUpsell && (
        <div style={{ border: '1px solid var(--gold-200)', backgroundColor: 'var(--gold-50)', padding: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
            Accelerate with coaching
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 500 }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--green-900)', fontWeight: 500, marginBottom: 10 }}>
                3 sessions with a certified Pathfinder practitioner
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.65 }}>
                Your {a.primaryDomain} work is the constraint. A practitioner who has seen your full profile — Formation Score, all sub-domain scores, the structural gaps — can compress 12 months of development into 90 days.
              </p>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--green-900)', fontWeight: 500, marginBottom: 12 }}>£1,497</div>
              <Link href="/upgrade?product=coaching_bundle" style={{ display: 'inline-block', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, padding: '14px 22px', borderRadius: 2, textDecoration: 'none' }}>
                Book 3 coaching sessions →
              </Link>
            </div>
          </div>
        </div>
      )}

      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-30)', textAlign: 'center', marginTop: 24, letterSpacing: '0.08em' }}>
        WHOLENESS INDEX™ · FULL TRAPEZIUM ASSESSMENT · PATHFINDER EDUCATIONAL LTD. · © 2026
      </p>
    </div>
  )
}
