import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHeader } from '../dashboard/_components/DashboardHeader'
import { SettingsForm } from './_components/SettingsForm'

export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} userEmail={user.email ?? ''} />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-medium">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile and account.</p>
        </div>

        <SettingsForm profile={profile} />
      </main>
    </div>
  )
}
