import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getDomain } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: { handle: string }
}

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
  created_at: string
}

async function getProfile(handle: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, handle, display_name, bio')
    .eq('handle', handle)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getProfile(params.handle)
  if (!profile) return { title: 'Not found' }
  return {
    title: profile.display_name ?? `@${profile.handle}`,
    description: profile.bio ?? `Bookmarks by @${profile.handle}`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const profile = await getProfile(params.handle)

  if (!profile) {
    notFound()
    return null
  }

  const supabase = createClient()
  const { data: bookmarksData } = await supabase
    .from('bookmarks')
    .select('id, title, url, description, created_at')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const bookmarks: Bookmark[] = bookmarksData ?? []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-16">
        <header className="mb-10">
          <h1 className="text-2xl font-medium">
            {profile.display_name ?? `@${profile.handle}`}
          </h1>
          {profile.display_name && (
            <p className="text-sm text-muted-foreground mt-0.5">
              @{profile.handle}
            </p>
          )}
          {profile.bio && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </header>

        {bookmarks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No public bookmarks yet.</p>
        ) : (
          <ul className="space-y-3">
            {bookmarks.map(b => (
              <li
                key={b.id}
                className="group border border-border rounded-xl p-4 hover:border-foreground/20 transition-colors"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <p className="font-medium text-sm group-hover:underline">{b.title}</p>
                  {b.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {b.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{getDomain(b.url)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(b.created_at)}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-16 pt-6 border-t border-border">
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by Linkvault
          </a>
        </footer>
      </div>
    </div>
  )
}