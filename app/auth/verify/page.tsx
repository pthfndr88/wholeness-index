import Link from 'next/link'

export default function VerifyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream-100)', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--green-900)', marginBottom: 12, fontWeight: 500 }}>Check your email</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-70)', marginBottom: 24, lineHeight: 1.6 }}>
          A sign-in link has been sent. Click it to access your account.
        </p>
        <Link href="/auth" style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-800)', textDecoration: 'none' }}>Back to sign in</Link>
      </div>
    </div>
  )
}
