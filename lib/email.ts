import { Resend } from 'resend'
import { ARCHETYPES } from './archetypes'
import type { ArchetypeKey } from './classifier'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }
  return new Resend(apiKey)
}
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@wholenessindex.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wholenessindex.com'

const base = (content: string) => `
  <div style="font-family:'Inter Tight',system-ui,sans-serif;max-width:600px;margin:0 auto;background:#F4EEE3;padding:0">
    <div style="background:#1F3A32;padding:24px 40px;display:flex;align-items:center;gap:12px">
      <span style="font-family:Georgia,serif;font-size:18px;color:#B8955A">◆</span>
      <span style="font-size:14px;font-weight:500;color:#FAF7F1;letter-spacing:0.01em">Wholeness Index™</span>
    </div>
    <div style="padding:40px">
      ${content}
    </div>
    <div style="padding:20px 40px;border-top:1px solid rgba(26,22,20,0.08)">
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(26,22,20,0.4);letter-spacing:0.1em;margin:0">
        © 2026 PATHFINDER EDUCATIONAL LTD. · WHOLENESS INDEX™
      </p>
    </div>
  </div>`

const btn = (href: string, text: string) =>
  `<a href="${href}" style="display:inline-block;background:#1F3A32;color:#FAF7F1;text-decoration:none;padding:14px 24px;font-size:14px;font-weight:500;border-radius:2px;margin-top:24px">${text}</a>`

const eyebrow = (text: string) =>
  `<p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#8C6E3E;text-transform:uppercase;margin:0 0 12px">${text}</p>`

// ─── Magic link ───────────────────────────────────────────────────────────────
export async function sendMagicLinkEmail(to: string, magicLink: string) {
  await getResendClient().emails.send({
    from: FROM, to,
    subject: 'Sign in to Wholeness Index',
    html: base(`
      ${eyebrow('Access')}
      <h1 style="font-family:Georgia,serif;font-size:32px;color:#0F2520;margin:0 0 12px;font-weight:500">Sign in</h1>
      <p style="font-size:15px;color:rgba(26,22,20,0.72);line-height:1.6;margin:0">
        Click below to sign in. This link expires in 24 hours and can only be used once.
      </p>
      ${btn(magicLink, 'Sign in →')}
      <p style="font-size:12px;color:rgba(26,22,20,0.4);margin-top:24px">
        If you did not request this, you can safely ignore it.
      </p>
    `),
  })
}

// ─── Rapid result email ───────────────────────────────────────────────────────
export async function sendRapidResultEmail(to: string, archetypeKey: ArchetypeKey) {
  const a = ARCHETYPES[archetypeKey]
  await getResendClient().emails.send({
    from: FROM, to,
    subject: `Your Wholeness Index reading: ${a.name}`,
    html: base(`
      ${eyebrow('Your reading')}
      <h1 style="font-family:Georgia,serif;font-size:42px;color:#0F2520;margin:0 0 8px;font-weight:500;line-height:1.05">${a.name}</h1>
      <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:rgba(26,22,20,0.72);margin:0 0 24px;line-height:1.5">${a.tagline}</p>
      <div style="background:#FAF7F1;border:1px solid rgba(26,22,20,0.08);padding:24px;margin-bottom:24px">
        <p style="font-size:15px;color:rgba(26,22,20,0.72);line-height:1.65;margin:0">${a.meaning}</p>
      </div>
      ${eyebrow('Your first moves')}
      ${a.dos.map(d => `<p style="font-size:14px;color:rgba(26,22,20,0.72);margin:0 0 8px;padding-left:16px;position:relative">
        <span style="position:absolute;left:0;color:#B8955A;font-family:Georgia,serif;font-style:italic">→</span>${d}
      </p>`).join('')}
      <div style="margin-top:32px;padding:24px;background:#FAF7F1;border:1px solid #E3CFA7;text-align:center">
        ${eyebrow('Go deeper')}
        <p style="font-size:15px;color:rgba(26,22,20,0.72);margin:0 0 20px">
          The full 130-item Trapezium Assessment gives you your Formation Score, Alignment Index, and a 6–24 month development roadmap.
        </p>
        ${btn(`${APP_URL}/upgrade`, 'Unlock full assessment — £197')}
        <p style="font-size:12px;color:rgba(26,22,20,0.4);margin-top:12px">Or use a discount code at checkout</p>
      </div>
    `),
  })
}

// ─── Purchase confirmation ────────────────────────────────────────────────────
export async function sendPurchaseConfirmationEmail(to: string, productType: string, amountPaid: number) {
  const productName = productType === 'full_assessment'
    ? 'Full Trapezium Assessment'
    : 'Assessment + Coaching Bundle'
  const amountStr = `£${(amountPaid / 100).toFixed(2)}`

  await getResendClient().emails.send({
    from: FROM, to,
    subject: `Payment confirmed — ${productName}`,
    html: base(`
      ${eyebrow('Payment confirmed')}
      <h1 style="font-family:Georgia,serif;font-size:32px;color:#0F2520;margin:0 0 12px;font-weight:500">You're in.</h1>
      <p style="font-size:15px;color:rgba(26,22,20,0.72);line-height:1.6;margin:0 0 24px">
        <strong>${productName}</strong> · ${amountStr} paid
      </p>
      <div style="background:#FAF7F1;border:1px solid rgba(26,22,20,0.08);padding:24px;margin-bottom:24px">
        <p style="font-size:14px;color:rgba(26,22,20,0.72);line-height:1.6;margin:0">
          Your full assessment is now unlocked. Sign in to begin — it takes 25–35 minutes and produces your Formation Score, Alignment Index, and Structural Integrity Index.
        </p>
      </div>
      ${btn(`${APP_URL}/platform`, 'Begin full assessment →')}
    `),
  })
}

// ─── Invitation email ─────────────────────────────────────────────────────────
export async function sendInvitationEmail(to: string, opts: {
  engagementName: string
  coachName: string
  assessmentUrl: string
}) {
  await getResendClient().emails.send({
    from: FROM, to,
    subject: `${opts.coachName} has invited you to complete the Wholeness Index`,
    html: base(`
      ${eyebrow('You have been invited')}
      <h1 style="font-family:Georgia,serif;font-size:32px;color:#0F2520;margin:0 0 12px;font-weight:500">
        Complete the Wholeness Index
      </h1>
      <p style="font-size:15px;color:rgba(26,22,20,0.72);line-height:1.6;margin:0 0 24px">
        <strong>${opts.coachName}</strong> has invited you as part of <strong>${opts.engagementName}</strong>.
        Your result is private — you decide whether to share it with your coach once you see it.
      </p>
      <p style="font-size:14px;color:rgba(26,22,20,0.5);margin:0 0 8px">15 statements · 8 minutes · no account needed</p>
      ${btn(opts.assessmentUrl, 'Begin assessment →')}
    `),
  })
}

// ─── Coaching upsell email (sent after full results) ─────────────────────────
export async function sendCoachingUpsellEmail(to: string, archetypeKey: ArchetypeKey) {
  const a = ARCHETYPES[archetypeKey]
  await getResendClient().emails.send({
    from: FROM, to,
    subject: `Your ${a.name} pathway — what happens next`,
    html: base(`
      ${eyebrow('Next steps')}
      <h1 style="font-family:Georgia,serif;font-size:32px;color:#0F2520;margin:0 0 12px;font-weight:500">
        What moves the ${a.name} fastest
      </h1>
      <p style="font-size:15px;color:rgba(26,22,20,0.72);line-height:1.6;margin:0 0 24px">
        Your platform access gives you a structured development pathway. For ${a.primaryDomain} work specifically, a certified Pathfinder practitioner can compress a 12-month arc into 90 days.
      </p>
      <div style="background:#FAF7F1;border:1px solid #E3CFA7;padding:24px;margin-bottom:24px">
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#8C6E3E;text-transform:uppercase;margin:0 0 8px">3 x 1-on-1 coaching sessions</p>
        <p style="font-family:Georgia,serif;font-size:20px;color:#0F2520;margin:0 0 8px;font-weight:500">£1,497 · includes full assessment</p>
        <p style="font-size:14px;color:rgba(26,22,20,0.5);margin:0">Deducted from your existing purchase</p>
      </div>
      ${btn(`${APP_URL}/upgrade?product=coaching_bundle`, 'Book coaching sessions →')}
    `),
  })
}
