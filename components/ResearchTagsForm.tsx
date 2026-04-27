'use client'
import { useState } from 'react'

interface Props {
  resultId: string
  onComplete?: () => void
}

const SECTORS = [
  ['technology', 'Technology'],
  ['education', 'Education'],
  ['healthcare', 'Healthcare'],
  ['finance', 'Finance & Banking'],
  ['public_sector', 'Public Sector'],
  ['ngo', 'NGO / Charity'],
  ['legal', 'Legal'],
  ['consulting', 'Consulting'],
  ['creative', 'Creative & Media'],
  ['other', 'Other'],
]

const ROLE_LEVELS = [
  ['individual_contributor', 'Individual contributor'],
  ['team_lead', 'Team lead'],
  ['manager', 'Manager'],
  ['senior_manager', 'Senior manager'],
  ['director', 'Director'],
  ['vp', 'VP / Head of'],
  ['c_suite', 'C-suite / Executive'],
  ['founder', 'Founder / Entrepreneur'],
  ['freelance', 'Freelance / Independent'],
  ['student', 'Student'],
]

const ORG_SIZES = [
  ['solo', 'Just me'],
  ['2_10', '2–10'],
  ['11_50', '11–50'],
  ['51_200', '51–200'],
  ['201_1000', '201–1,000'],
  ['1001_5000', '1,001–5,000'],
  ['5000_plus', '5,000+'],
]

export default function ResearchTagsForm({ resultId, onComplete }: Props) {
  const [sector, setSector] = useState('')
  const [roleLevel, setRoleLevel] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [country, setCountry] = useState('')
  const [orgSize, setOrgSize] = useState('')
  const [consent, setConsent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [skipped, setSkipped] = useState(false)

  const handleSubmit = async () => {
    if (!consent) return
    setSaving(true)
    try {
      await fetch('/api/research/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId, sector, roleLevel,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
          country, orgSize, consent,
        }),
      })
      setDone(true)
      onComplete?.()
    } catch {}
    setSaving(false)
  }

  const label = (text: string) => (
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-50)', textTransform: 'uppercase' as const, marginBottom: 8 }}>
      {text}
    </div>
  )

  const select = (value: string, onChange: (v: string) => void, options: string[][], placeholder: string) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: '100%', padding: '12px 14px', border: '1px solid var(--ink-15)',
      backgroundColor: 'var(--cream-50)', borderRadius: 2,
      fontFamily: 'var(--sans)', fontSize: 14, color: value ? 'var(--ink)' : 'var(--ink-30)',
      outline: 'none', marginBottom: 16,
    }}>
      <option value="">{placeholder}</option>
      {options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
    </select>
  )

  if (done) {
    return (
      <div style={{ border: '1px solid var(--green-100)', backgroundColor: 'var(--green-50)', padding: 20 }}>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#1F3A32' }}>
          ✓ Thank you. Your context helps the Sterizo Research Group build more precise intelligence.
        </p>
      </div>
    )
  }

  if (skipped) return null

  return (
    <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>
        Optional · Sterizo Research Group
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--green-900)', fontWeight: 500, marginBottom: 8 }}>
        Help us build better intelligence.
      </h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', marginBottom: 20, lineHeight: 1.6 }}>
        Your result contributes to the Sterizo Research Group&apos;s archetype intelligence. Adding context helps us understand which patterns appear in which environments — producing richer findings for the field. Entirely optional. Entirely anonymous in all published research.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <div>
          {label('Sector')}
          {select(sector, setSector, SECTORS, 'Select sector')}
        </div>
        <div>
          {label('Role level')}
          {select(roleLevel, setRoleLevel, ROLE_LEVELS, 'Select level')}
        </div>
        <div>
          {label('Organisation size')}
          {select(orgSize, setOrgSize, ORG_SIZES, 'Select size')}
        </div>
        <div>
          {label('Country (ISO code, e.g. GB)')}
          <input type="text" value={country} onChange={e => setCountry(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="GB" maxLength={2}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-50)', borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)', outline: 'none', marginBottom: 16 }} />
        </div>
        <div>
          {label('Years of professional experience')}
          <input type="number" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)}
            placeholder="e.g. 12" min="0" max="50"
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-50)', borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)', outline: 'none', marginBottom: 16 }} />
        </div>
      </div>

      {/* Consent */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20, padding: '14px 16px', backgroundColor: 'var(--cream-100)', border: '1px solid var(--ink-08)' }}>
        <input type="checkbox" id="research-consent" checked={consent} onChange={e => setConsent(e.target.checked)}
          style={{ marginTop: 2, flexShrink: 0, accentColor: 'var(--green-800)' }} />
        <label htmlFor="research-consent" style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.5, cursor: 'pointer' }}>
          I consent to my anonymised demographic data being used by the Sterizo Research Group for research purposes. My individual responses will never be published or shared. I can withdraw consent by contacting research@wholenessindex.com.
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSubmit} disabled={!consent || saving} style={{
          backgroundColor: consent ? 'var(--green-800)' : 'var(--cream-100)',
          color: consent ? 'var(--cream-50)' : 'var(--ink-30)',
          border: consent ? '1px solid var(--green-800)' : '1px solid var(--ink-15)',
          borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
          padding: '12px 20px', cursor: consent ? 'pointer' : 'not-allowed',
        }}>
          {saving ? 'Saving…' : 'Submit context'}
        </button>
        <button onClick={() => setSkipped(true)} style={{
          backgroundColor: 'transparent', color: 'var(--ink-50)',
          border: 'none', fontFamily: 'var(--sans)', fontSize: 13,
          padding: '12px 14px', cursor: 'pointer',
        }}>
          Skip
        </button>
      </div>
    </div>
  )
}
