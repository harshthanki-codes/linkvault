import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserBookmarks } from '@/lib/actions/bookmarks'
import { BookmarkForm } from './_components/BookmarkForm'
import { BookmarkSearch } from './_components/BookmarkSearch'
import { ProfileSetup } from './_components/ProfileSetup'
import { DashboardHeader } from './_components/DashboardHeader'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [bookmarks, { data: profile }] = await Promise.all([
    getUserBookmarks(),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} userEmail={user.email ?? ''} />

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {!profile?.display_name && (
          <ProfileSetup currentHandle={profile?.handle ?? ''} />
        )}

        <BookmarkForm />

        <BookmarkSearch bookmarks={bookmarks} />
      </main>
    </div>
  )
}
