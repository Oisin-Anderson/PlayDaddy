'use client'

import React, { useState, useEffect } from 'react'

interface Playlist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
}

interface PlaylistSelectorProps {
  token: string
  onSelect: (playlist: Playlist) => void
  onBack: () => void
}

export default function PlaylistSelector({ token, onSelect, onBack }: PlaylistSelectorProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPlaylists()
  }, [token])

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('/api/spotify/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      if (!response.ok) throw new Error('Failed to fetch playlists')
      
      const { playlists } = await response.json()
      setPlaylists(playlists)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load playlists')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your playlists...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select a Playlist</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      {filteredPlaylists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm ? 'No playlists found matching your search.' : 'No playlists found.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onSelect(playlist)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                {playlist.images.length > 0 ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-lg">🎵</span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{playlist.name}</h3>
                <p className="text-sm text-gray-600">
                  {playlist.tracks.total} tracks
                  {playlist.description && ` • ${playlist.description}`}
                </p>
              </div>
              
              <div className="text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Found {filteredPlaylists.length} of {playlists.length} playlists
      </p>
    </div>
  )
} 