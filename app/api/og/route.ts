import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? 'Linkvault'
  const handle = searchParams.get('handle') ?? ''

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#fafaf8"/>
      <text x="60" y="280" font-family="system-ui, sans-serif" font-size="64" font-weight="500" fill="#1a1a18">
        ${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
      ${handle ? `<text x="60" y="340" font-family="system-ui, sans-serif" font-size="32" fill="#9a9893">@${handle}</text>` : ''}
      <text x="60" y="560" font-family="system-ui, sans-serif" font-size="24" fill="#c5c3bc">Linkvault</text>
    </svg>
  `

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
