import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">Linkvault</h1>
          <p className="text-muted-foreground">
            Save what matters. Share what you want.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-9 px-5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-9 px-5 rounded-md border border-input text-sm font-medium hover:bg-accent transition-colors"
          >
            Log in
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Free to use. No tracking.
        </p>
      </div>
    </main>
  )
}
