import { handleWebhookEvent } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendPurchaseConfirmationEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Must disable body parsing for Stripe webhook signature verification
export const config = { api: { bodyParser: false } }

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = await handleWebhookEvent(body, signature)
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { product_type, user_id, email } = session.metadata!
    const amountPaid = session.amount_total ?? 0
    const discountCode = session.client_reference_id ?? null

    const service = createServiceClient()

    // 1. Record the purchase
    const { data: purchase } = await service
      .from('purchases')
      .insert({
        user_id: user_id || null,
        email,
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent as string,
        product_type,
        amount_paid: amountPaid,
        discount_code: discountCode,
        status: 'completed',
      })
      .select()
      .single()

    // 2. Grant access
    if (purchase) {
      await service.from('access').insert({
        user_id: user_id || null,
        email,
        product_type,
        purchase_id: purchase.id,
      })
    }

    // 3. If coaching bundle, also grant full_assessment access
    if (product_type === 'coaching_bundle' && purchase) {
      await service.from('access').insert({
        user_id: user_id || null,
        email,
        product_type: 'full_assessment',
        purchase_id: purchase.id,
      })
    }

    // 4. Send confirmation email
    try {
      await sendPurchaseConfirmationEmail(email, product_type, amountPaid)
    } catch (e) {
      console.error('Confirmation email failed:', e)
    }
  }

  return NextResponse.json({ received: true })
}
