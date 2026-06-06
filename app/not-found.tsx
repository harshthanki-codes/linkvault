import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">Page not found</p>
        <Link href="/" className="text-sm hover:underline">
          Go home
        </Link>
      </div>
    </div>
  )
}
