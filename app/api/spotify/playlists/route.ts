import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Spotify playlists error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch playlists' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Filter out playlists with no tracks
    const playlists = data.items.filter((playlist: any) => playlist.tracks.total > 0)

    return NextResponse.json({ playlists })

  } catch (error) {
    console.error('Playlists fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 