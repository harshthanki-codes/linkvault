import { Resend } from 'resend'
import { WelcomeEmail } from './templates/Welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, handle: string) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_ADDRESS!,
      to,
      subject: 'Welcome to Linkvault',
      react: WelcomeEmail({
        handle,
        appUrl: process.env.NEXT_PUBLIC_APP_URL!,
      }),
    })
  } catch (err) {
    console.error('[resend] welcome email failed:', err)
  }
}
