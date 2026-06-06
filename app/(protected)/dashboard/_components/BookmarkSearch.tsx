'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { BookmarkCard } from './BookmarkCard'
import type { Database } from '@/types/supabase'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']
type Filter = 'all' | 'public' | 'private'

interface Props {
  bookmarks: Bookmark[]
}

export function BookmarkSearch({ bookmarks }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'public' && b.is_public) ||
        (filter === 'private' && !b.is_public)

      if (!matchesFilter) return false

      if (!query.trim()) return true

      const q = query.toLowerCase()
      return (
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        (b.description ?? '').toLowerCase().includes(q)
      )
    })
  }, [bookmarks, query, filter])

  const publicCount  = bookmarks.filter(b => b.is_public).length
  const privateCount = bookmarks.filter(b => !b.is_public).length

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">No bookmarks yet.</p>
        <p className="text-xs mt-1">Add your first one above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search bookmarks…"
          className="flex-1"
        />
        <div className="flex rounded-md border border-input overflow-hidden shrink-0">
          {(['all', 'public', 'private'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {f === 'all'
                ? `All (${bookmarks.length})`
                : f === 'public'
                ? `Public (${publicCount})`
                : `Private (${privateCount})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No bookmarks match your search.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <BookmarkCard key={b.id} bookmark={b} />
          ))}
        </div>
      )}
    </div>
  )
}
