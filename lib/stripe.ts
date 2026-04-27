import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export const PRODUCTS = {
  full_assessment: {
    name: 'Wholeness Index — Full Assessment',
    description: '88-item Trapezium Assessment · Formation Score · Alignment Index · 6–24 month development roadmap',
    priceId: process.env.STRIPE_PRICE_FULL_ASSESSMENT!,
    amount: 19700,
  },
  coaching_bundle: {
    name: 'Wholeness Index — Assessment + Coaching',
    description: 'Full assessment plus 3 x 1-on-1 coaching sessions with a certified Pathfinder practitioner',
    priceId: process.env.STRIPE_PRICE_COACHING_BUNDLE!,
    amount: 149700,
  },
}

export async function createCheckoutSession({
  email, productType, userId, resultId,
}: {
  email: string
  productType: keyof typeof PRODUCTS
  userId?: string
  resultId?: string
}) {
  const product = PRODUCTS[productType]
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [{ price: product.priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${APP_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/upgrade?cancelled=true`,
    metadata: {
      product_type: productType,
      user_id: userId ?? '',
      result_id: resultId ?? '',
      email,
    },
  })
  return session
}

export async function handleWebhookEvent(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
