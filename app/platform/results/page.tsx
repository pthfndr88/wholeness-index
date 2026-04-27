import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ARCHETYPES } from '@/lib/archetypes'
import type { ArchetypeKey } from '@/lib/classifier'
import TrapeziumDial from '@/components/TrapeziumDial'
import Link from 'next/link'

export default async function PlatformResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth?redirect=/platform/results')

  const { data: result } = await supabase
    .from('results')
    .select('*')
    .eq('user_id', user.id)
    .eq('instrument', 'FULL')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!result) redirect('/platform')

  const a = ARCHETYPES[result.archetype as ArchetypeKey]
  const scores: [number, number, number, number] = [
    result.score_i, result.score_ch, result.score_co, result.score_im,
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 48px', borderBottom: '1px solid var(--ink-08)', position: 'sticky', top: 0, backgroundColor: 'var(--cream-100)', zIndex: 20 }}>
        <Link href="/platform" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>←</span> Platform
        </Link>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>FULL RESULTS</span>
      </header>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px' }}>
        <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: '36px 40px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>Your full results</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5vw, 60px)', color: 'var(--green-900)', fontWeight: 500, lineHeight: 1.05, marginBottom: 8 }}>{a?.name}</h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-70)', marginBottom: 16 }}>{a?.tagline}</p>
        </div>
        {result.formation_score && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Formation Index', value: result.formation_score, desc: 'Wholeness' },
              { label: 'Alignment Index', value: result.alignment_index, desc: 'Balance' },
              { label: 'Structural Integrity', value: result.structural_index, desc: 'Strength' },
            ].map(idx => (
              <div key={idx.label} style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 24 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 6 }}>{idx.label}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--green-900)', fontWeight: 500 }}>{idx.value?.toFixed(3)}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-50)' }}>{idx.desc}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrapeziumDial scores={scores} size={300} />
          </div>
          <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>The reading</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.65 }}>{a?.meaning}</p>
          </div>
        </div>
        <div style={{ border: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-50)', padding: 28 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 16 }}>Your first moves</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {a?.dos.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ color: 'var(--gold-600)', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', lineHeight: 1.5 }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
