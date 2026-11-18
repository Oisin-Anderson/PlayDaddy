import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const REDIRECT_URI = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function GET() {
  if (!SPOTIFY_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Spotify client ID not configured' },
      { status: 500 }
    )
  }

  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-private'
  ].join(' ')

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${REDIRECT_URI}/api/spotify/callback`,
    scope: scopes,
    state: Math.random().toString(36).substring(7)
  })}`

  return NextResponse.json({ authUrl })
} 