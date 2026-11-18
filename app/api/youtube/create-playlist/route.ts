import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const { name, description, tracks, token } = await request.json()

    if (!name || !tracks || !Array.isArray(tracks)) {
      return NextResponse.json(
        { error: 'Playlist name and tracks array are required' },
        { status: 400 }
      )
    }

    if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'YouTube OAuth credentials not configured' },
        { status: 500 }
      )
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      YOUTUBE_CLIENT_ID,
      YOUTUBE_CLIENT_SECRET,
      `${REDIRECT_URI}/api/youtube/callback`
    )

    // Set credentials (in a real app, you'd get this from user's OAuth flow)
    // For now, we'll use the token directly
    oauth2Client.setCredentials({
      access_token: token
    })

    const youtube = google.youtube('v3')

    // Create the playlist
    const playlistResponse = await youtube.playlists.insert({
      auth: oauth2Client,
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: name,
          description: description || `Playlist transferred from Spotify`,
          tags: ['music', 'playlist', 'transferred']
        },
        status: {
          privacyStatus: 'private' // Start as private for safety
        }
      }
    })

    if (!playlistResponse.data.id) {
      return NextResponse.json(
        { error: 'Failed to create playlist' },
        { status: 500 }
      )
    }

    const playlistId = playlistResponse.data.id

    // Add tracks to the playlist
    const addPromises = tracks.map(async (track: any) => {
      try {
        await youtube.playlistItems.insert({
          auth: oauth2Client,
          part: ['snippet'],
          requestBody: {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: track.videoId
              }
            }
          }
        })
        return { success: true, track }
      } catch (error) {
        console.error('Failed to add track:', track, error)
        return { success: false, track, error }
      }
    })

    const results = await Promise.all(addPromises)
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      playlistId,
      playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
      addedTracks: successful,
      failedTracks: failed,
      totalTracks: tracks.length
    })

  } catch (error) {
    console.error('YouTube playlist creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create YouTube playlist' },
      { status: 500 }
    )
  }
} 