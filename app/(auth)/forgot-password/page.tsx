'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="bg-background border border-border rounded-xl p-8 shadow-sm text-center space-y-3">
        <h1 className="text-xl font-medium">Email sent</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If an account exists for <strong className="text-foreground font-medium">{email}</strong>,
          you'll get a reset link shortly.
        </p>
        <Link href="/login" className="text-sm text-foreground hover:underline block pt-2">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-xl p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Reset password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email and we'll send a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-6">
        <Link href="/login" className="text-foreground hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}
