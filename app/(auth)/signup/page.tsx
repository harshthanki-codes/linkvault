'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUpWithEmail } from '@/lib/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const result = await signUpWithEmail(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="bg-background border border-border rounded-xl p-8 shadow-sm text-center space-y-3">
        <h1 className="text-xl font-medium">Check your email</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We sent a confirmation link to{' '}
          <strong className="text-foreground font-medium">{email}</strong>.
          Click it to activate your account.
        </p>
        <p className="text-xs text-muted-foreground">Check your spam folder if you don't see it.</p>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-xl p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start saving your bookmarks</p>
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
            autoComplete="email"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
