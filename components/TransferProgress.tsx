'use client'

import React from 'react'

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

interface TransferProgressProps {
  playlist: Playlist
  progress: {
    current: number
    total: number
    status: string
    matchedTracks: Array<{ spotify: Track; youtube: any }>
    failedTracks: Array<Track>
  }
  onReset: () => void
}

export default function TransferProgress({ playlist, progress, onReset }: TransferProgressProps) {
  const { current, total, status, matchedTracks, failedTracks } = progress
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  const isComplete = status.includes('✅') || status.includes('❌')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transferring Playlist</h2>
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-gray-700"
        >
          Start Over
        </button>
      </div>
      
      {/* Playlist Info */}
      <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
          {playlist.images.length > 0 ? (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <span className="text-gray-500 text-2xl">🎵</span>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{playlist.name}</h3>
          <p className="text-sm text-gray-600">
            {total} tracks • {percentage}% complete
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{current} / {total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Status */}
      <div className="mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">{status}</p>
        </div>
      </div>
      
      {/* Results Summary */}
      {isComplete && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-green-600 text-lg mr-2">✅</span>
              <h3 className="font-semibold text-green-800">Successfully Matched</h3>
            </div>
            <p className="text-green-700 text-2xl font-bold">{matchedTracks.length}</p>
            <p className="text-green-600 text-sm">tracks found on YouTube Music</p>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-red-600 text-lg mr-2">❌</span>
              <h3 className="font-semibold text-red-800">Failed to Match</h3>
            </div>
            <p className="text-red-700 text-2xl font-bold">{failedTracks.length}</p>
            <p className="text-red-600 text-sm">tracks not found</p>
          </div>
        </div>
      )}
      
      {/* Failed Tracks List */}
      {failedTracks.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tracks Not Found on YouTube Music:</h3>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            {failedTracks.map((track, index) => (
              <div key={index} className="p-3 border-b border-gray-100 last:border-b-0">
                <p className="font-medium text-gray-900">{track.name}</p>
                <p className="text-sm text-gray-600">
                  {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {status.includes('✅') && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-600 text-2xl mr-3">🎉</span>
            <div>
              <h3 className="font-semibold text-green-800">Transfer Complete!</h3>
              <p className="text-green-700">
                Your playlist has been successfully transferred to YouTube Music.
                {matchedTracks.length > 0 && ` ${matchedTracks.length} tracks were added.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 