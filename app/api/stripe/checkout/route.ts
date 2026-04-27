import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, PRODUCTS } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { productType, resultId } = await request.json()

    if (!productType || !PRODUCTS[productType as keyof typeof PRODUCTS]) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get email — from auth user or require it in body
    const email = user?.email
    if (!email) {
      return NextResponse.json({ error: 'Email required — please sign in first' }, { status: 401 })
    }

    const session = await createCheckoutSession({
      email,
      productType: productType as keyof typeof PRODUCTS,
      userId: user?.id,
      resultId,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
