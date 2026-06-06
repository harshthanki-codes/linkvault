'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { bookmarkSchema, type BookmarkInput } from '@/lib/validations'

async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function createBookmark(input: BookmarkInput) {
  const { supabase, user } = await getUser()

  const parsed = bookmarkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const insertData = {
    title: parsed.data.title,
    url: parsed.data.url,
    description: parsed.data.description ?? null,
    is_public: parsed.data.is_public,
    user_id: user.id,
  }

  const { error } = await (supabase.from('bookmarks') as any).insert(insertData)

  if (error) return { error: { root: [error.message] } }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateBookmark(id: string, input: BookmarkInput) {
  const { supabase, user } = await getUser()

  const parsed = bookmarkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const updateData = {
    title: parsed.data.title,
    url: parsed.data.url,
    description: parsed.data.description ?? null,
    is_public: parsed.data.is_public,
  }

  const { error } = await (supabase.from('bookmarks') as any)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: { root: [error.message] } }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  const { supabase, user } = await getUser()

  const { error } = await (supabase.from('bookmarks') as any)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleBookmarkVisibility(id: string, is_public: boolean) {
  const { supabase, user } = await getUser()

  const { error } = await (supabase.from('bookmarks') as any)
    .update({ is_public })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getUserBookmarks() {
  const { supabase, user } = await getUser()

  const { data, error } = await (supabase.from('bookmarks') as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Array<{
    id: string
    user_id: string
    title: string
    url: string
    description: string | null
    is_public: boolean
    created_at: string
    updated_at: string
  }>
}