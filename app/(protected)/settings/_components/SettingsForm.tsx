'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/lib/actions/profile'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface Props {
  profile: Profile | null
}

export function SettingsForm({ profile }: Props) {
  const router = useRouter()
  const [handle, setHandle] = useState(profile?.handle ?? '')
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [saved, setSaved] = useState(false)

  const [signingOut, setSigningOut] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSaved(false)

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

    setSaved(true)
    setLoading(false)
    router.refresh()
  }

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      'This will permanently delete your account and all your bookmarks. This cannot be undone.\n\nType DELETE to confirm.'
    )
    if (!confirmed) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium">Profile</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="handle">Handle</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm shrink-0">
                @
              </span>
              <Input
                id="handle"
                value={handle}
                onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="rounded-l-none"
                required
                minLength={3}
                maxLength={24}
              />
            </div>
            {errors.handle && <p className="text-xs text-destructive">{errors.handle[0]}</p>}
            <p className="text-xs text-muted-foreground">
              Your public profile lives at /{handle || 'yourhandle'}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={60}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="A line about yourself"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
            {saved && (
              <span className="text-xs text-muted-foreground animate-fade-in">Saved.</span>
            )}
          </div>
        </form>
      </section>

      <section className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium">Account</h2>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm">Sign out</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sign out of this browser session.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-destructive">Delete account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently removes your account and all bookmarks.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </Button>
        </div>
      </section>
    </div>
  )
}
