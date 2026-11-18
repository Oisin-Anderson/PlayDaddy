'use client'

import React, { useState } from 'react'
import PlaylistTransfer from '../components/PlaylistTransfer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎵 PlayDaddy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transfer your Spotify playlists to YouTube Music seamlessly
          </p>
        </div>
        
        <PlaylistTransfer />
        
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Connect Spotify</h3>
              <p className="text-sm text-gray-600">Login with your Spotify account and select a playlist</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Match Songs</h3>
              <p className="text-sm text-gray-600">We'll find each song on YouTube Music automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Create Playlist</h3>
              <p className="text-sm text-gray-600">Your new YouTube Music playlist will be ready to enjoy</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 