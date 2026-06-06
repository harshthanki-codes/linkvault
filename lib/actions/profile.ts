'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { profileSchema, type ProfileInput } from '@/lib/validations'

export async function updateProfile(input: ProfileInput) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('handle', parsed.data.handle)
    .neq('id', user.id)
    .maybeSingle()

  if (existing) {
    return { error: { handle: ['This handle is already taken'] } }
  }

  const oldProfile = await supabase
    .from('profiles')
    .select('handle')
    .eq('id', user.id)
    .single()

  const { error } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id)

  if (error) return { error: { root: [error.message] } }

  revalidatePath('/dashboard')
  if (oldProfile.data?.handle) {
    revalidatePath(`/@${oldProfile.data.handle}`)
  }
  revalidatePath(`/@${parsed.data.handle}`)

  return { success: true }
}

export async function getProfileByHandle(handle: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, handle, display_name, bio')
    .eq('handle', handle)
    .maybeSingle()
  return data
}
