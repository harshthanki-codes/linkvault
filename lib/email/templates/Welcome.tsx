import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface Props {
  handle: string
  appUrl: string
}

export function WelcomeEmail({ handle, appUrl }: Props) {
  const profileUrl = `${appUrl}/@${handle}`

  return (
    <Html>
      <Head />
      <Preview>Your Linkvault is ready</Preview>
      <Body style={{ backgroundColor: '#f6f5f2', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: 520, margin: '48px auto', backgroundColor: '#ffffff', borderRadius: 12, padding: '40px 36px' }}>
          <Heading style={{ fontSize: 22, fontWeight: 500, color: '#1a1a18', margin: '0 0 16px' }}>
            You're in.
          </Heading>
          <Text style={{ color: '#5a5955', lineHeight: 1.65, margin: '0 0 20px' }}>
            Your account is set up and your public profile is live. Share it whenever you're ready.
          </Text>

          <Section style={{ backgroundColor: '#f6f5f2', borderRadius: 8, padding: '14px 18px', margin: '0 0 24px' }}>
            <Link href={profileUrl} style={{ color: '#3d3cff', fontWeight: 500, textDecoration: 'none', fontSize: 15 }}>
              {profileUrl}
            </Link>
          </Section>

          <Text style={{ color: '#5a5955', lineHeight: 1.65, margin: '0 0 28px' }}>
            Add bookmarks from your dashboard and mark any of them as public — they'll appear on your profile automatically.
          </Text>

          <Link
            href={`${appUrl}/dashboard`}
            style={{
              display: 'inline-block',
              backgroundColor: '#1a1a18',
              color: '#ffffff',
              padding: '11px 22px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Go to dashboard
          </Link>

          <Text style={{ color: '#9a9893', fontSize: 13, marginTop: 36, lineHeight: 1.5 }}>
            If you didn't create this account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
