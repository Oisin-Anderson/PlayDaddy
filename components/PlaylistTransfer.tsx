'use client'

import React, { useState, useEffect } from 'react'
import SpotifyLogin from './SpotifyLogin'
import PlaylistSelector from './PlaylistSelector'
import TransferProgress from './TransferProgress'

interface Playlist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
}

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
  }
}

export default function PlaylistTransfer() {
  const [step, setStep] = useState<'login' | 'select' | 'transfer'>('login')
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [transferProgress, setTransferProgress] = useState<{
    current: number
    total: number
    status: string
    matchedTracks: Array<{ spotify: Track; youtube: any }>
    failedTracks: Array<Track>
  }>({
    current: 0,
    total: 0,
    status: '',
    matchedTracks: [],
    failedTracks: []
  })

  const handleSpotifyLogin = (token: string) => {
    setSpotifyToken(token)
    setStep('select')
  }

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setStep('transfer')
    startTransfer(playlist, spotifyToken!)
  }

  const startTransfer = async (playlist: Playlist, token: string) => {
    try {
      setTransferProgress(prev => ({ ...prev, status: 'Fetching playlist tracks...' }))
      
      // Fetch playlist tracks from Spotify
      const response = await fetch('/api/spotify/playlist-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId: playlist.id, token })
      })
      
      if (!response.ok) throw new Error('Failed to fetch playlist tracks')
      
      const { tracks } = await response.json()
      setTransferProgress(prev => ({ ...prev, total: tracks.length }))
      
      // Match tracks on YouTube Music
      setTransferProgress(prev => ({ ...prev, status: 'Matching tracks on YouTube Music...' }))
      
      const matchPromises = tracks.map(async (track: Track, index: number) => {
        try {
          const matchResponse = await fetch('/api/youtube/search-track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query: `${track.name} ${track.artists[0].name}`,
              token 
            })
          })
          
          if (matchResponse.ok) {
            const { videoId } = await matchResponse.json()
            setTransferProgress(prev => ({
              ...prev,
              current: index + 1,
              matchedTracks: [...prev.matchedTracks, { spotify: track, youtube: { videoId } }]
            }))
            return { track, videoId }
          } else {
            setTransferProgress(prev => ({
              ...prev,
              current: index + 1,
              failedTracks: [...prev.failedTracks, track]
            }))
            return { track, videoId: null }
          }
        } catch (error) {
          setTransferProgress(prev => ({
            ...prev,
            current: index + 1,
            failedTracks: [...prev.failedTracks, track]
          }))
          return { track, videoId: null }
        }
      })
      
      const matchedTracks = await Promise.all(matchPromises)
      const successfulMatches = matchedTracks.filter(match => match.videoId)
      
      if (successfulMatches.length > 0) {
        setTransferProgress(prev => ({ ...prev, status: 'Creating YouTube Music playlist...' }))
        
        // Create YouTube Music playlist
        const createResponse = await fetch('/api/youtube/create-playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: playlist.name,
            description: `Transferred from Spotify: ${playlist.description || ''}`,
            tracks: successfulMatches,
            token
          })
        })
        
        if (createResponse.ok) {
          const { playlistId } = await createResponse.json()
          setTransferProgress(prev => ({ 
            ...prev, 
            status: `✅ Transfer complete! Playlist created: ${playlistId}` 
          }))
        } else {
          setTransferProgress(prev => ({ 
            ...prev, 
            status: '❌ Failed to create YouTube Music playlist' 
          }))
        }
      } else {
        setTransferProgress(prev => ({ 
          ...prev, 
          status: '❌ No tracks could be matched on YouTube Music' 
        }))
      }
      
    } catch (error) {
      console.error('Transfer error:', error)
      setTransferProgress(prev => ({ 
        ...prev, 
        status: '❌ Transfer failed. Please try again.' 
      }))
    }
  }

  const resetTransfer = () => {
    setStep('login')
    setSpotifyToken(null)
    setSelectedPlaylist(null)
    setTransferProgress({
      current: 0,
      total: 0,
      status: '',
      matchedTracks: [],
      failedTracks: []
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {step === 'login' && (
        <SpotifyLogin onLogin={handleSpotifyLogin} />
      )}
      
      {step === 'select' && spotifyToken && (
        <PlaylistSelector 
          token={spotifyToken} 
          onSelect={handlePlaylistSelect}
          onBack={() => setStep('login')}
        />
      )}
      
      {step === 'transfer' && selectedPlaylist && (
        <TransferProgress 
          playlist={selectedPlaylist}
          progress={transferProgress}
          onReset={resetTransfer}
        />
      )}
    </div>
  )
} 