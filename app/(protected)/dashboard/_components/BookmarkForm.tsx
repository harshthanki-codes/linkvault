'use client'

import { useState } from 'react'
import { createBookmark } from '@/lib/actions/bookmarks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const empty = { title: '', url: '', description: '', is_public: false }

export function BookmarkForm() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: [] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const result = await createBookmark({
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

    setForm(empty)
    setOpen(false)
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border border-dashed border-border rounded-xl px-4 py-4 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-left"
      >
        + Add a bookmark
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border rounded-xl p-5 space-y-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">New bookmark</span>
        <button
          type="button"
          onClick={() => { setOpen(false); setForm(empty); setErrors({}) }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="My favourite article"
            required
            autoFocus
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            value={form.url}
            onChange={e => set('url', e.target.value)}
            placeholder="https://"
            required
          />
          {errors.url && <p className="text-xs text-destructive">{errors.url[0]}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="What's this about?"
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between">
        <Switch
          id="is_public"
          checked={form.is_public}
          onChange={e => set('is_public', (e.target as HTMLInputElement).checked)}
          label="Show on public profile"
        />

        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Saving…' : 'Save bookmark'}
        </Button>
      </div>
    </form>
  )
}
