import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { playlistId, token } = await request.json()

    if (!playlistId || !token) {
      return NextResponse.json(
        { error: 'Playlist ID and access token are required' },
        { status: 400 }
      )
    }

    const tracks: any[] = []
    let offset = 0
    const limit = 100

    while (true) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Spotify playlist tracks error:', errorData)
        return NextResponse.json(
          { error: 'Failed to fetch playlist tracks' },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      // Extract track information from playlist items
      const playlistTracks = data.items
        .filter((item: any) => item.track && !item.track.is_local)
        .map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists,
          album: {
            name: item.track.album.name
          },
          duration_ms: item.track.duration_ms,
          external_urls: item.track.external_urls
        }))

      tracks.push(...playlistTracks)

      // Check if we've fetched all tracks
      if (data.items.length < limit) {
        break
      }

      offset += limit
    }

    return NextResponse.json({ tracks })

  } catch (error) {
    console.error('Playlist tracks fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 