import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_SECRET ?? ''

/**
 * GET — Meta webhook verification challenge.
 * Meta sends: hub.mode=subscribe, hub.verify_token, hub.challenge
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

/**
 * POST — Incoming WhatsApp message events.
 * Verifies X-Hub-Signature-256, then persists text messages as chat_messages rows.
 */
export async function POST(req: NextRequest) {
  // Verify signature
  const rawBody = await req.text()
  const signature = req.headers.get('x-hub-signature-256') ?? ''
  const appSecret = process.env.WHATSAPP_APP_SECRET ?? VERIFY_TOKEN
  if (appSecret) {
    const expected = 'sha256=' + createHmac('sha256', appSecret).update(rawBody).digest('hex')
    try {
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
    } catch {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  let body: WhatsAppPayload
  try {
    body = JSON.parse(rawBody)
  } catch {
    return new NextResponse('Bad Request', { status: 400 })
  }

  // Process each entry > changes > messages
  const entries = body?.entry ?? []
  const supabase = createAdminClient()

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const msgs = change.value?.messages ?? []
      for (const msg of msgs) {
        if (msg.type !== 'text') continue
        const fromPhone = msg.from // E.164 without +
        const localPhone = fromPhone.startsWith('966') ? `0${fromPhone.slice(3)}` : fromPhone
        const text = msg.text?.body ?? ''

        // Find a profile with this WhatsApp number
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('whatsapp_number', localPhone)
          .maybeSingle()

        if (!profile) continue // Unknown sender — ignore

        // Find an open RFQ for this user to attach message to
        const { data: rfq } = await supabase
          .from('rfqs')
          .select('id')
          .eq('user_id', profile.id)
          .neq('status', 'closed')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!rfq) continue

        await supabase.from('chat_messages').insert({
          rfq_id: rfq.id,
          sender_id: profile.id,
          content: text,
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface WhatsAppPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string
          type: string
          text?: { body: string }
          id: string
          timestamp: string
        }>
      }
    }>
  }>
}
