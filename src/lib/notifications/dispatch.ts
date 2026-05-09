import { createAdminClient } from '@/lib/supabase/admin'

export type NotifyChannel = 'in_app' | 'email' | 'whatsapp'

export interface NotifyParams {
  userId: string
  title: string
  message?: string
  type?: 'rfq_update' | 'new_message' | 'quotation' | 'system' | 'contact_message'
  link?: string
  channels?: NotifyChannel[]
  metadata?: Record<string, unknown>
}

/**
 * Dispatch a notification to a user. Honours the user's `notification_prefs`
 * column on `profiles`. The in-app channel always inserts a row in
 * `notifications`. Email + WhatsApp dispatching is delegated to provider
 * stubs so this layer stays provider-agnostic.
 */
export async function notify(params: NotifyParams) {
  let admin
  try {
    admin = createAdminClient()
  } catch {
    return { ok: false, reason: 'no_admin_client' as const }
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('id,email,whatsapp_number,notification_prefs')
    .eq('id', params.userId)
    .maybeSingle()

  if (!profile) return { ok: false, reason: 'no_profile' as const }

  const prefs = (profile.notification_prefs ?? {}) as Record<NotifyChannel, boolean>
  const channels = params.channels ?? (['in_app', 'email', 'whatsapp'] as NotifyChannel[])

  // In-app row (always written if pref allows)
  if (channels.includes('in_app') && prefs.in_app !== false) {
    await admin.from('notifications').insert({
      user_id: params.userId,
      title: params.title,
      message: params.message ?? '',
      type: params.type ?? 'system',
      link: params.link ?? null,
      metadata: params.metadata ?? {},
      is_read: false,
    })
  }

  // Email (provider stub — wire to Resend/SendGrid in production)
  if (channels.includes('email') && prefs.email && profile.email) {
    await sendEmailStub({
      to: profile.email,
      subject: params.title,
      body: params.message ?? '',
      link: params.link,
    })
  }

  // WhatsApp (provider stub — wire to Twilio/Meta WA Business API)
  if (channels.includes('whatsapp') && prefs.whatsapp && profile.whatsapp_number) {
    await sendWhatsAppStub({
      to: profile.whatsapp_number,
      message: `${params.title}\n${params.message ?? ''}${params.link ? '\n' + params.link : ''}`,
    })
  }

  return { ok: true as const }
}

async function sendEmailStub(payload: {
  to: string
  subject: string
  body: string
  link?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'notifications@eastplus.sa'
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') console.log('[notify:email] no RESEND_API_KEY', payload.to)
    return
  }
  const html = `<div dir="rtl" style="font-family:sans-serif;max-width:600px;margin:auto">
    <h2 style="color:#D4B87C">${payload.subject}</h2>
    <p>${payload.body}</p>
    ${payload.link ? `<a href="${payload.link}" style="color:#D4B87C">عرض التفاصيل</a>` : ''}
    <hr style="margin-top:32px;border-color:#eee"/>
    <p style="font-size:11px;color:#999">EAST PLUS — إيست بلاس للمقاولات</p>
  </div>`
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [payload.to], subject: payload.subject, html }),
    })
  } catch (err) {
    console.error('[notify:email] failed', err)
  }
}

async function sendWhatsAppStub(payload: { to: string; message: string }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) {
    if (process.env.NODE_ENV !== 'production') console.log('[notify:whatsapp] no WA creds', payload.to)
    return
  }
  // Sanitize phone: remove spaces/dashes, ensure E.164
  const to = payload.to.replace(/\D/g, '').replace(/^0/, '966')
  try {
    await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: payload.message },
      }),
    })
  } catch (err) {
    console.error('[notify:whatsapp] failed', err)
  }
}
