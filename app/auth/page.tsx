'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AuthPage() {
  const redirect =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('redirect') ?? '/'
      : '/'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream-100)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>Check your inbox</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--green-900)', marginBottom: 12, fontWeight: 500 }}>Sign-in link sent.</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-70)', marginBottom: 28, lineHeight: 1.6 }}>
            We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
          </p>
          <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)' }}>
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream-100)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-50)', textDecoration: 'none' }}>
            ← Wholeness Index
          </Link>
        </div>
        <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 40 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>Access</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--green-900)', marginBottom: 6, fontWeight: 500 }}>Sign in</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-50)', marginBottom: 32 }}>Access your results and coach portal.</p>

          {error && (
            <div style={{ backgroundColor: 'var(--gold-50)', border: '1px solid var(--gold-200)', padding: '10px 14px', marginBottom: 20, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--gold-700)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 8 }}>
                Email address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-50)', borderRadius: 2, fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading || !email} style={{
              backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
              border: '1px solid var(--green-800)', borderRadius: 2,
              fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
              padding: '16px 22px', cursor: loading || !email ? 'not-allowed' : 'pointer',
              opacity: loading || !email ? 0.6 : 1, transition: 'all 160ms',
            }}>
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-30)', letterSpacing: '0.08em', textAlign: 'center', marginTop: 20 }}>
          NO PASSWORD · MAGIC LINK · SECURE
        </p>
      </div>
    </div>
  )
}
