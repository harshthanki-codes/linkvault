export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border h-14" />
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="h-36 rounded-xl border border-border bg-muted/40 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl border border-border bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
