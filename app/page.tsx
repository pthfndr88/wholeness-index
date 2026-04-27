'use client'
import { useState } from 'react'
import Link from 'next/link'

const PATTERNS = [
  { key: 'seeker',         name: 'The Seeker',         tagline: 'Knowledge without strength',  sig: [0.78, 0.42, 0.58, 0.48] },
  { key: 'powerhouse',     name: 'The Powerhouse',     tagline: 'Strength without direction',  sig: [0.46, 0.82, 0.74, 0.52] },
  { key: 'hidden-gem',     name: 'The Hidden Gem',     tagline: 'Potential without visibility', sig: [0.72, 0.74, 0.76, 0.34] },
  { key: 'fragmented',     name: 'The Fragmented',     tagline: 'Scattered energy',             sig: [0.52, 0.48, 0.54, 0.51] },
  { key: 'aligned-leader', name: 'The Aligned Leader', tagline: 'Compound formation',           sig: [0.86, 0.84, 0.82, 0.84] },
]

function MiniTrapezium({ sig }: { sig: number[] }) {
  const size = 52, cx = size / 2
  const baseW = size * 0.9, topW = size * 0.22, totalH = size * 0.78
  const yBase = size * 0.92, yTop = yBase - totalH
  const wAtY = (y: number) => baseW + (topW - baseW) * ((yBase - y) / totalH)
  const weights = [120, 60, 60, 120]
  const colors = ['#1F3A32', '#3E6057', '#8C6E3E', '#B8955A']
  let yc = yBase
  const bands = weights.map((w, i) => {
    const yB = yc, yT = yc - (w / 360) * totalH
    const wB = wAtY(yB), wT = wAtY(yT)
    const pts = `${cx - wT/2},${yT} ${cx + wT/2},${yT} ${cx + wB/2},${yB} ${cx - wB/2},${yB}`
    yc = yT
    return { pts, score: sig[i], color: colors[i] }
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <polygon points={`${cx - baseW/2},${yBase} ${cx + baseW/2},${yBase} ${cx + topW/2},${yTop} ${cx - topW/2},${yTop}`} fill="none" stroke="#B8955A" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
      {bands.map((b, i) => <polygon key={i} points={b.pts} fill={b.color} fillOpacity={0.25 + 0.75 * b.score} stroke={b.color} strokeWidth="0.6" strokeOpacity={0.6} />)}
    </svg>
  )
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      {/* Nav */}
      <header className="r-chrome" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-08)', backgroundColor: 'var(--cream-100)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--gold-500)', color: 'var(--gold-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 13 }}>◆</div>
          <span style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 15, color: 'var(--green-900)' }}>Wholeness Index™</span>
        </div>
        <nav className="r-nav-full" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/auth" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)', textDecoration: 'none', padding: '10px 14px' }}>Sign in</Link>
          <Link href="/auth?role=coach" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)', textDecoration: 'none', padding: '10px 14px' }}>Coach portal</Link>
          <Link href="/take" style={{ backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, padding: '14px 22px', borderRadius: 2, textDecoration: 'none' }}>Begin the Index</Link>
        </nav>
        <button className="r-nav-mobile" onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none', flexDirection: 'column', gap: 5 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 1.5, backgroundColor: 'var(--green-800)' }} />)}
        </button>
      </header>

      {/* Mobile overlay */}
      <div className={`mobile-nav-overlay${menuOpen ? ' open' : ''}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--cream-50)' }}>×</button>
        {[{ href: '/take', label: 'Begin the Index' }, { href: '/upgrade', label: 'Full assessment' }, { href: '/auth?role=coach', label: 'Coach portal' }, { href: '/auth', label: 'Sign in' }].map(item => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--cream-50)', textDecoration: 'none' }}>{item.label}</Link>
        ))}
      </div>

      {/* Hero */}
      <section className="r-section" style={{ maxWidth: 1280, margin: '0 auto', paddingTop: 80, paddingBottom: 64 }}>
        <div style={{ marginBottom: 24 }}><span className="eyebrow">Wholeness Index™</span></div>
        <h1 className="r-hero-title" style={{ fontFamily: 'var(--serif)', lineHeight: 1.08, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--green-900)', marginBottom: 24, maxWidth: 820 }}>
          Capable.<br />Experienced.<br />
          <span style={{ color: 'var(--gold-600)', fontStyle: 'italic' }}>And yet — feeling stuck.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.65, color: 'var(--ink-70)', maxWidth: 560, marginBottom: 36, fontFamily: 'var(--sans)' }}>
          The Index assesses four domains whose alignment is the precondition for meaningful contribution — and returns the specific constraint holding the rest.
        </p>
        <div className="r-stack-mobile" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <Link href="/take" style={{ backgroundColor: 'var(--green-800)', color: 'var(--cream-50)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, padding: '16px 26px', borderRadius: 2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Free rapid assessment <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>→</span>
          </Link>
          <Link href="/upgrade" style={{ backgroundColor: 'transparent', color: 'var(--green-900)', border: '1px solid var(--ink-30)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, padding: '16px 26px', borderRadius: 2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Full assessment — £197
          </Link>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.08em' }}>
          Rapid: 15 items · 8 minutes · free · Full: 130 items · 25 minutes · £197
        </div>
      </section>

      {/* Divider */}
      <div className="r-page" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--gold-500)', opacity: 0.5 }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--gold-500)' }} />
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--gold-500)', opacity: 0.5 }} />
        </div>
      </div>

      {/* Patterns */}
      <section className="r-section" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 10 }}><span className="eyebrow">Five recurring formations</span></div>
        <p style={{ fontSize: 16, color: 'var(--ink-70)', maxWidth: 540, lineHeight: 1.6, marginBottom: 40, fontFamily: 'var(--sans)' }}>
          Responses cluster into five recurring shapes. Each is a diagnosis, not a destiny.
        </p>
        <div className="r-grid-5">
          {PATTERNS.map(p => (
            <div key={p.key} style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 20 }}>
              <div style={{ marginBottom: 14 }}><MiniTrapezium sig={p.sig} /></div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--green-900)', marginBottom: 6, fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold-700)', letterSpacing: '0.1em' }}>{p.tagline}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="r-show-mobile" style={{ display: 'none', position: 'sticky', bottom: 0, backgroundColor: 'var(--green-900)', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/take" style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: 'var(--gold-500)', color: 'var(--green-900)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, padding: 16, borderRadius: 2, textDecoration: 'none' }}>
          Begin the Index →
        </Link>
      </div>

      {/* Footer */}
      <footer className="r-page" style={{ borderTop: '1px solid var(--ink-08)', padding: '40px 48px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.08em' }}>
          © 2026 PATHFINDER EDUCATIONAL LTD. · WHOLENESS INDEX™
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-50)', fontFamily: 'var(--sans)', flexWrap: 'wrap' }}>
          <Link href="/take" style={{ color: 'inherit', textDecoration: 'none' }}>Free assessment</Link>
          <Link href="/upgrade" style={{ color: 'inherit', textDecoration: 'none' }}>Full assessment</Link>
          <Link href="/auth?role=coach" style={{ color: 'inherit', textDecoration: 'none' }}>For coaches</Link>
        </div>
      </footer>
    </div>
  )
}
