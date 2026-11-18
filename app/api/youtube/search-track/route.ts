import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { query, token } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      )
    }

    const youtube = google.youtube('v3')

    // Search for the track on YouTube
    const searchResponse = await youtube.search.list({
      key: YOUTUBE_API_KEY,
      part: ['snippet'],
      q: `${query} music`,
      type: ['video'],
      videoCategoryId: '10', // Music category
      maxResults: 5,
      order: 'relevance'
    })

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return NextResponse.json(
        { error: 'No videos found' },
        { status: 404 }
      )
    }

    // Get the first result (most relevant)
    const video = searchResponse.data.items[0]
    
    if (!video.id?.videoId) {
      return NextResponse.json(
        { error: 'No video ID found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      videoId: video.id.videoId,
      title: video.snippet?.title,
      channelTitle: video.snippet?.channelTitle
    })

  } catch (error) {
    console.error('YouTube search error:', error)
    return NextResponse.json(
      { error: 'Failed to search YouTube' },
      { status: 500 }
    )
  }
} 