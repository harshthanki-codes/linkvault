'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row'] | null

interface Props {
  profile: Profile
  userEmail: string
}

export function DashboardHeader({ profile, userEmail }: Props) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-medium text-sm">
            Linkvault
          </Link>
          {profile?.handle && (
            <Link
              href={`/@${profile.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              /@{profile.handle}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground hidden sm:block mr-2">{userEmail}</span>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="text-xs">
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            disabled={signingOut}
            className="text-xs"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </div>
    </header>
  )
}
