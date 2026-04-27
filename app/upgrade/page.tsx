'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const checkout = async (productType: string) => {
    if (!user) {
      window.location.href = '/auth?redirect=/upgrade'
      return
    }
    setLoading(productType)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setLoading(null)
    }
  }

  const card = (
    title: string,
    price: string,
    originalPrice: string | null,
    description: string,
    features: string[],
    productType: string,
    primary: boolean
  ) => (
    <div style={{
      backgroundColor: 'var(--cream-50)', border: primary ? '1px solid var(--gold-500)' : '1px solid var(--ink-08)',
      padding: 36, flex: 1, position: 'relative',
    }}>
      {primary && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'var(--gold-500)', color: 'var(--green-900)',
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em',
          textTransform: 'uppercase', padding: '4px 12px',
        }}>Most popular</div>
      )}
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 40, color: 'var(--green-900)', fontWeight: 500 }}>{price}</span>
        {originalPrice && (
          <span style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink-30)', textDecoration: 'line-through' }}>{originalPrice}</span>
        )}
      </div>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-50)', marginBottom: 24, lineHeight: 1.5 }}>{description}</p>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)' }}>
            <span style={{ color: 'var(--gold-600)', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>→</span>{f}
          </li>
        ))}
      </ul>
      <button onClick={() => checkout(productType)} disabled={!!loading} style={{
        width: '100%', backgroundColor: primary ? 'var(--green-800)' : 'transparent',
        color: primary ? 'var(--cream-50)' : 'var(--green-900)',
        border: primary ? '1px solid var(--green-800)' : '1px solid var(--ink-30)',
        borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
        padding: '16px 22px', cursor: loading ? 'wait' : 'pointer',
        opacity: loading && loading !== productType ? 0.5 : 1, transition: 'all 160ms',
      }}>
        {loading === productType ? 'Redirecting to checkout…' : 'Continue →'}
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 48px', borderBottom: '1px solid var(--ink-08)' }}>
        <Link href="/" style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500, color: 'var(--green-900)', textDecoration: 'none' }}>
          Wholeness Index™
        </Link>
        {user && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.1em' }}>{user.email}</span>}
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '72px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>
            Unlock the full picture
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--green-900)', fontWeight: 500, lineHeight: 1.05, marginBottom: 16 }}>
            The rapid classifier showed you the shape.<br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-600)' }}>The full assessment shows you the path.</span>
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 17, color: 'var(--ink-70)', maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
            130 items. Formation Score. Alignment Index. A sequenced 6–24 month development roadmap built around your specific pattern.
          </p>

          {/* Discount code notice */}
          <div style={{ display: 'inline-block', margin: '24px auto 0', backgroundColor: 'var(--gold-50)', border: '1px solid var(--gold-200)', padding: '12px 20px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-700)', textTransform: 'uppercase' }}>
              Have a discount code? Enter it at checkout — Stripe applies it automatically.
            </span>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--gold-50)', border: '1px solid var(--gold-200)', padding: '12px 20px', marginBottom: 24, textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--gold-700)' }}>{error}</span>
          </div>
        )}

        {!user && (
          <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 20, marginBottom: 32, textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', margin: '0 0 12px' }}>
              Sign in first so your purchase is linked to your account.
            </p>
            <Link href="/auth?redirect=/upgrade" style={{
              backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '10px 18px', borderRadius: 2, textDecoration: 'none', display: 'inline-block',
            }}>Sign in →</Link>
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {card(
            'Full assessment',
            '£197',
            null,
            'Deep diagnostic. Self-directed development.',
            [
              '88-item Trapezium Assessment',
              'Formation Score · Alignment Index · Structural Integrity Index',
              'Sub-domain scoring across all four domains',
              'PDF report with full analysis',
              'Platform access — sequenced 6–24 month development pathway',
              'Discount code reduces to £79.99',
            ],
            'full_assessment',
            false
          )}
          {card(
            'Assessment + coaching',
            '£1,497',
            null,
            'For when you want expert guidance alongside the data.',
            [
              'Everything in Full Assessment',
              '3 x 1-on-1 sessions with a certified Pathfinder practitioner',
              'Sessions scheduled after full results are in',
              'Coach sees your full score breakdown',
              'Practitioner-led development planning',
            ],
            'coaching_bundle',
            true
          )}
        </div>

        <div style={{ marginTop: 36, padding: 28, backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 10 }}>
            How discount codes work
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-70)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Click any option above. At the Stripe checkout screen, you will see a field labelled <strong>&quot;Discount code&quot;</strong> or <strong>&quot;Promotional code&quot;</strong>. Enter your code there. A valid code reduces the Full Assessment to <strong>£79.99</strong>.
          </p>
        </div>
      </main>
    </div>
  )
}
