'use server'

import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email/resend'

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  // Profile row is created by DB trigger (handle_new_user).
  // We fetch it immediately to get the auto-generated handle for the welcome email.
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('handle')
      .eq('id', data.user.id)
      .maybeSingle()

    await sendWelcomeEmail(email, profile?.handle ?? email.split('@')[0])
  }

  return { success: true }
}
