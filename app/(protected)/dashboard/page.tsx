import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Profile = {
  id: string
  handle: string
  display_name: string | null
  bio: string | null
}

type Bookmark = {
  id: string
  title: string
  url: string
  description: string | null
  is_public: boolean
  user_id: string
}

type PageProps = {
  params: {
    handle: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient()

  const result = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', params.handle)
    .single()

  const profile = result.data as Profile | null

  if (!profile) {
    return {
      title: 'User Not Found',
    }
  }

  return {
    title: profile.display_name || `@${profile.handle}`,
    description:
      profile.bio || `Bookmarks by @${profile.handle}`,
  }
}

export default async function PublicProfilePage({
  params,
}: PageProps) {
  const supabase = createClient()

  const result = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', params.handle)
    .single()

  const profile = result.data as Profile | null

  if (!profile) {
    notFound()
  }

  const bookmarksResult = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const bookmarks = (bookmarksResult.data ?? []) as Bookmark[]

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {profile.display_name || profile.handle}
        </h1>

        <p className="text-muted-foreground">
          @{profile.handle}
        </p>

        {profile.bio && (
          <p className="mt-4">
            {profile.bio}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="rounded-lg border p-4"
          >
            <h3 className="font-semibold">
              {bookmark.title}
            </h3>

            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600"
            >
              {bookmark.url}
            </a>

            {bookmark.description && (
              <p className="mt-2 text-sm">
                {bookmark.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}