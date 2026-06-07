// Component Page
import { Suspense } from 'react'
import { LoginForm } from './_components/LoginForm'

export const metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-background border border-border rounded-xl p-8 shadow-sm h-64 animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
