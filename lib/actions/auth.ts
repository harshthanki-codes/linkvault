'use server'

import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email/resend'

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  if (data.user) {
    const userId: string = data.user.id
    const { data: profileData } = await supabase
      .from('profiles')
      .select('handle')
      .eq('id', userId)
      .maybeSingle()

    const handle: string = (profileData as { handle: string } | null)?.handle ?? email.split('@')[0]
    await sendWelcomeEmail(email, handle)
  }

  return { success: true }
}
