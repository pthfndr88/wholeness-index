'use client'
import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { ARCHETYPES } from '@/lib/archetypes'
import { formatDate } from '@/lib/utils'
import type { ArchetypeKey } from '@/lib/classifier'

const INTEL: Partial<Record<string, string>> = {
  gem:  'High Hidden Gem proportion signals systematic under-recognition. Group visibility workshop before individual coaching recommended.',
  seek: 'Seekers need character activation, not more self-knowledge. Design micro-experiments with observable outputs.',
  pow:  'Powerhouses need identity work before more challenge. Purpose reflection reduces attrition risk.',
  frag: 'Fragmented participants need stabilisation before any standard curriculum lands.',
  aln:  'Aligned Leaders need multiplication focus. Design for legacy and systemic influence.',
}

interface Engagement {
  id: string
  slug: string
  name: string
  instrument: string
  createdAt: string
  deadline: string | null
  invitedCount: number
  completedCount: number
  sharedCount: number
}

interface EngagementResult {
  archetype?: string
  confidence?: number
  sharedWithCoach?: boolean
}

interface Invitation {
  id: string
  email: string
  sentAt: string
  status: string
  results?: EngagementResult[]
}

interface EngagementPayload {
  engagement: Engagement
  invitations: Invitation[]
  distribution: Record<string, number>
}

export default function EngagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<EngagementPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'participants'>('overview')
  const [emails, setEmails] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ succeeded: number; failed: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/engagements/${id}`).then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const deployLink = data ? `https://wholenessindex.com/take/${data.engagement.slug}` : ''

  const copyLink = () => {
    navigator.clipboard.writeText(deployLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendInvites = async () => {
    const list = emails.split(/[\n,]+/).map((e: string) => e.trim()).filter(Boolean)
    if (!list.length) return
    setSending(true)
    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engagementId: id, emails: list }),
    })
    const r = await res.json()
    setSendResult(r)
    setSending(false)
    setEmails('')
    load()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)', letterSpacing: '0.14em' }}>LOADING…</span>
    </div>
  )
  if (!data) return <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--gold-700)' }}>Engagement not found</div>

  const { engagement, invitations, distribution } = data
  const rate = engagement.invitedCount > 0 ? Math.round((engagement.completedCount / engagement.invitedCount) * 100) : 0
  const dominant = distribution
    ? Object.entries(distribution).sort(([, a], [, b]) => b - a)[0]
    : null

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link href="/coach" style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-50)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>←</span> Engagements
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>Engagement</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--green-900)', fontWeight: 500, marginBottom: 4, lineHeight: 1.1 }}>{engagement.name}</h1>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.08em' }}>
            {engagement.instrument} · Created {formatDate(engagement.createdAt)}
            {engagement.deadline && ` · Due ${formatDate(engagement.deadline)}`}
          </div>
        </div>
        <a href={`/api/export/${engagement.id}`} style={{
          backgroundColor: 'transparent', color: 'var(--green-900)', border: '1px solid var(--ink-30)',
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, padding: '10px 16px',
          borderRadius: 2, textDecoration: 'none',
        }}>Export CSV</a>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { l: 'Invited', v: engagement.invitedCount },
          { l: 'Completed', v: engagement.completedCount },
          { l: 'Rate', v: engagement.invitedCount > 0 ? `${rate}%` : '—' },
          { l: 'Shared', v: engagement.sharedCount },
        ].map(m => (
          <div key={m.l} style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--green-900)', fontWeight: 500 }}>{m.v}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Deploy link */}
      <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 10 }}>Deployment link</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '10px 14px', backgroundColor: 'var(--cream-100)', border: '1px solid var(--ink-08)', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-70)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {deployLink}
          </div>
          <button onClick={copyLink} style={{
            backgroundColor: 'transparent', color: 'var(--green-900)', border: '1px solid var(--ink-30)',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, padding: '10px 16px', borderRadius: 2, cursor: 'pointer', flexShrink: 0,
          }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--ink-08)', marginBottom: 20 }}>
        {(['overview', 'participants'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 16px', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
            background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--green-800)' : '2px solid transparent',
            color: tab === t ? 'var(--green-900)' : 'var(--ink-50)', cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Distribution */}
          <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 28 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 16 }}>
              Archetype distribution
            </div>
            {!distribution || !Object.keys(distribution).length ? (
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-50)' }}>No shared results yet</p>
            ) : (
              <div>
                {Object.entries(distribution).sort(([, a], [, b]) => b - a).map(([arch, count]) => {
                  const a = ARCHETYPES[arch as ArchetypeKey]
                  const pct = engagement.completedCount > 0 ? Math.round((count / engagement.completedCount) * 100) : 0
                  return (
                    <div key={arch} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)' }}>{a?.name ?? arch}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-50)' }}>{count}</span>
                      </div>
                      <div style={{ height: 3, backgroundColor: 'var(--ink-08)' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--gold-500)', width: `${pct}%`, transition: 'width 500ms' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {dominant && engagement.completedCount >= 3 && INTEL[dominant[0]] && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--ink-08)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>Intelligence note</div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-70)', lineHeight: 1.6 }}>{INTEL[dominant[0]]}</p>
              </div>
            )}
          </div>

          {/* Invite */}
          <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)', padding: 28 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 12 }}>Invite by email</div>
            <textarea value={emails} onChange={e => setEmails(e.target.value)}
              placeholder={'james@company.com\npriya@company.com'} rows={6}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--ink-15)', backgroundColor: 'var(--cream-100)', borderRadius: 2, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)', outline: 'none', resize: 'vertical' }} />
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.08em', marginTop: 6, marginBottom: 14 }}>One per line or comma-separated</p>
            <button onClick={sendInvites} disabled={sending || !emails.trim()} style={{
              width: '100%', backgroundColor: 'var(--green-800)', color: 'var(--cream-50)',
              border: '1px solid var(--green-800)', borderRadius: 2,
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '14px 20px', cursor: sending || !emails.trim() ? 'not-allowed' : 'pointer',
              opacity: sending || !emails.trim() ? 0.5 : 1,
            }}>
              {sending ? 'Sending…' : 'Send invitations'}
            </button>
            {sendResult && (
              <div style={{ marginTop: 12, padding: '10px 14px', backgroundColor: 'var(--green-50)', border: '1px solid var(--green-100)', fontFamily: 'var(--sans)', fontSize: 13, color: '#1F3A32' }}>
                ✓ {sendResult.succeeded} sent{sendResult.failed > 0 && ` · ${sendResult.failed} failed`}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'participants' && (
        <div style={{ backgroundColor: 'var(--cream-50)', border: '1px solid var(--ink-08)' }}>
          {!invitations?.length ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-50)' }}>
              No participants yet. Share the deployment link or send email invites above.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ink-08)' }}>
                  {['Participant', 'Archetype', 'Confidence', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--ink-50)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => {
                  const result = inv.results?.[0]
                  const archKey = result?.archetype?.toLowerCase() as ArchetypeKey
                  const arch = result ? ARCHETYPES[archKey] : null
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid var(--ink-08)' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--green-900)' }}>{inv.email}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-50)', letterSpacing: '0.08em' }}>Invited {formatDate(inv.sentAt)}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {arch && result?.sharedWithCoach ? (
                          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, padding: '4px 10px', backgroundColor: 'var(--gold-50)', color: 'var(--gold-700)', border: '1px solid var(--gold-200)' }}>
                            {arch.name}
                          </span>
                        ) : result ? (
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-30)', letterSpacing: '0.08em' }}>Not shared</span>
                        ) : <span style={{ color: 'var(--ink-30)' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {arch && result?.sharedWithCoach
                          ? <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-70)' }}>{Math.round((result.confidence ?? 0) * 100)}%</span>
                          : <span style={{ color: 'var(--ink-30)' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em',
                          color: inv.status === 'completed' ? '#1F3A32' : inv.status === 'opened' ? 'var(--gold-700)' : 'var(--ink-30)',
                        }}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
