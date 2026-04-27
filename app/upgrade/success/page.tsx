'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UpgradeSuccessPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Give webhook a moment to process
    setTimeout(() => setReady(true), 2000)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 48, color: 'var(--gold-500)', marginBottom: 24 }}>◆</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
          Payment confirmed
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 42, color: 'var(--green-900)', fontWeight: 500, marginBottom: 16, lineHeight: 1.1 }}>
          You&apos;re in.
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink-70)', marginBottom: 32, lineHeight: 1.65 }}>
          Your full assessment is now unlocked. A confirmation email is on its way. The assessment takes 25–35 minutes — take it when you can give it your full attention.
        </p>
        {ready ? (
          <Link href="/platform" style={{
            display: 'inline-block', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
            fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500,
            padding: '18px 32px', borderRadius: 2, textDecoration: 'none',
          }}>
            Begin full assessment →
          </Link>
        ) : (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>
            Activating your access…
          </div>
        )}
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-30)', letterSpacing: '0.08em', marginTop: 32 }}>
          WHOLENESS INDEX™ · PATHFINDER EDUCATIONAL LTD.
        </p>
      </div>
    </div>
  )
}
