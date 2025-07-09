import { NextResponse } from 'next/server'

export async function GET() {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  return NextResponse.json({
    emailjs_configured: !!(serviceId && templateId && publicKey),
    service_id_exists: !!serviceId,
    template_id_exists: !!templateId,
    public_key_exists: !!publicKey,
    // Don't expose actual values for security
    service_id_preview: serviceId ? serviceId.substring(0, 10) + '...' : null,
    template_id_preview: templateId ? templateId.substring(0, 10) + '...' : null,
    public_key_preview: publicKey ? publicKey.substring(0, 10) + '...' : null,
  })
}
