import { BookmarkCard } from './BookmarkCard'
import type { Database } from '@/types/supabase'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

interface Props {
  bookmarks: Bookmark[]
}

export function BookmarkList({ bookmarks }: Props) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">No bookmarks yet.</p>
        <p className="text-xs mt-1">Add your first one above.</p>
      </div>
    )
  }

  const publicCount = bookmarks.filter(b => b.is_public).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
          {publicCount > 0 && ` · ${publicCount} public`}
        </span>
      </div>
      {bookmarks.map(b => (
        <BookmarkCard key={b.id} bookmark={b} />
      ))}
    </div>
  )
}
