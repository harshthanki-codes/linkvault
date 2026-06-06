'use client'

import { useState } from 'react'
import { updateBookmark, deleteBookmark, toggleBookmarkVisibility } from '@/lib/actions/bookmarks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getDomain, formatDate } from '@/lib/utils'
import type { Database } from '@/types/supabase'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

interface Props {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [form, setForm] = useState({
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description ?? '',
    is_public: bookmark.is_public,
  })

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const result = await updateBookmark(bookmark.id, {
      title: form.title,
      url: form.url,
      description: form.description || undefined,
      is_public: form.is_public,
    })

    if (result.error && typeof result.error === 'object') {
      setErrors(result.error as Record<string, string[]>)
      setLoading(false)
      return
    }

    setEditing(false)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this bookmark?')) return
    setDeleting(true)
    await deleteBookmark(bookmark.id)
  }

  async function handleToggle() {
    setToggling(true)
    await toggleBookmarkVisibility(bookmark.id, !bookmark.is_public)
    setToggling(false)
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSave}
        className="border border-border rounded-xl p-4 space-y-4 animate-fade-in"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`title-${bookmark.id}`}>Title</Label>
            <Input
              id={`title-${bookmark.id}`}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
              autoFocus
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`url-${bookmark.id}`}>URL</Label>
            <Input
              id={`url-${bookmark.id}`}
              type="url"
              value={form.url}
              onChange={e => set('url', e.target.value)}
              required
            />
            {errors.url && <p className="text-xs text-destructive">{errors.url[0]}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`desc-${bookmark.id}`}>Description</Label>
          <Textarea
            id={`desc-${bookmark.id}`}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <Switch
            id={`pub-${bookmark.id}`}
            checked={form.is_public}
            onChange={e => set('is_public', (e.target as HTMLInputElement).checked)}
            label="Public"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className="group border border-border rounded-xl p-4 hover:border-foreground/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sm hover:underline truncate"
            >
              {bookmark.title}
            </a>
            {bookmark.is_public && (
              <Badge variant="secondary" className="text-xs shrink-0">public</Badge>
            )}
          </div>

          {bookmark.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {bookmark.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground">
              {getDomain(bookmark.url)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(bookmark.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent transition-colors"
            title={bookmark.is_public ? 'Make private' : 'Make public'}
          >
            {bookmark.is_public ? 'Private' : 'Public'}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
