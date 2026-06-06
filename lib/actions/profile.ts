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

  const { data: existing } = await (supabase.from('profiles') as any)
    .select('id')
    .eq('handle', parsed.data.handle)
    .neq('id', user.id)
    .maybeSingle()

  if (existing) {
    return { error: { handle: ['This handle is already taken'] } }
  }

  const oldProfile = await (supabase.from('profiles') as any)
    .select('handle')
    .eq('id', user.id)
    .single()

  const updateData = {
    handle: parsed.data.handle,
    display_name: parsed.data.display_name ?? null,
    bio: parsed.data.bio ?? null,
  }

  const { error } = await (supabase.from('profiles') as any)
    .update(updateData)
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
  const { data } = await (supabase.from('profiles') as any)
    .select('id, handle, display_name, bio')
    .eq('handle', handle)
    .maybeSingle()
  return data as { id: string; handle: string; display_name: string | null; bio: string | null } | null
}