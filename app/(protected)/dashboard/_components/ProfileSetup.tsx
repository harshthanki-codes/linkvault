'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  currentHandle: string
}

export function ProfileSetup({ currentHandle }: Props) {
  const [handle, setHandle] = useState(currentHandle)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const result = await updateProfile({
      handle,
      display_name: displayName || undefined,
      bio: bio || undefined,
    })

    if (result.error && typeof result.error === 'object') {
      setErrors(result.error as Record<string, string[]>)
      setLoading(false)
      return
    }

    setDismissed(true)
    setLoading(false)
  }

  return (
    <div className="border border-border rounded-xl p-5 bg-muted/30 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">Set up your profile</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick a handle so others can find your public bookmarks.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-4 shrink-0"
        >
          Skip
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="handle">Handle</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                @
              </span>
              <Input
                id="handle"
                value={handle}
                onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="rounded-l-none"
                placeholder="yourhandle"
                required
              />
            </div>
            {errors.handle && <p className="text-xs text-destructive">{errors.handle[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="display_name">Display name <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="A short line about yourself"
            rows={2}
          />
        </div>

        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </div>
  )
}
