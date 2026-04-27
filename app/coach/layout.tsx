import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth?redirect=/coach')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['coach', 'org_admin', 'super_admin'].includes(profile.role)) {
    redirect('/auth?error=insufficient_role')
  }

  const name = profile?.full_name ?? user.email ?? 'Practitioner'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream-100)', display: 'flex' }}>
      <div className="r-sidebar" style={{ width: 240, backgroundColor: 'var(--green-900)', display: 'flex', flexDirection: 'column', position: 'fixed', inset: '0 auto 0 0', zIndex: 30 }}>
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--gold-500)', color: 'var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 12 }}>◆</div>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 14, color: 'var(--cream-50)' }}>Wholeness Index</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--gold-600)', textTransform: 'uppercase' }}>Practitioner Portal</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {[
            { href: '/coach', label: 'Engagements', mono: '01' },
            { href: '/coach/new', label: 'New engagement', mono: '02' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 2, textDecoration: 'none', marginBottom: 2 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--gold-600)', letterSpacing: '0.1em' }}>{item.mono}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--cream-200)' }}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, color: 'var(--cream-50)' }}>{initials}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--cream-200)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          </div>
        </div>
      </div>
      <div className="r-main-padded" style={{ marginLeft: 240, flex: 1 }}>
        <main className="coach-content" style={{ padding: '48px 56px', maxWidth: 1100 }}>{children}</main>
      </div>
      <style>{`@media (max-width: 768px) { .r-sidebar { display: none !important; } .r-main-padded { margin-left: 0 !important; } .coach-content { padding: 24px 20px !important; } }`}</style>
    </div>
  )
}
