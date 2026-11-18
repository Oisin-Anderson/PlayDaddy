'use client'

import React, { useState } from 'react'

interface SpotifyLoginProps {
  onLogin: (token: string) => void
}

export default function SpotifyLogin({ onLogin }: SpotifyLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSpotifyLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get Spotify authorization URL
      const response = await fetch('/api/spotify/auth-url')
      if (!response.ok) throw new Error('Failed to get authorization URL')
      
      const { authUrl } = await response.json()
      
      // Open Spotify auth in popup
      const popup = window.open(
        authUrl,
        'spotify-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )
      
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups and try again.')
      }
      
      // Listen for the callback
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          setIsLoading(false)
          setError('Authentication cancelled')
        }
      }, 1000)
      
      // Listen for message from popup
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
          clearInterval(checkClosed)
          popup.close()
          window.removeEventListener('message', handleMessage)
          
          const { code } = event.data
          
          // Exchange code for token
          const tokenResponse = await fetch('/api/spotify/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          })
          
          if (!tokenResponse.ok) {
            throw new Error('Failed to get access token')
          }
          
          const { accessToken } = await tokenResponse.json()
          setIsLoading(false)
          onLogin(accessToken)
        } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
          clearInterval(checkClosed)
          popup.close()
          window.removeEventListener('message', handleMessage)
          setIsLoading(false)
          setError(event.data.error || 'Authentication failed')
        }
      }
      
      window.addEventListener('message', handleMessage)
      
    } catch (error) {
      setIsLoading(false)
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🎵</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to Spotify</h2>
        <p className="text-gray-600">Login with your Spotify account to access your playlists</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={handleSpotifyLogin}
        disabled={isLoading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <span className="mr-2">🎵</span>
            Login with Spotify
          </>
        )}
      </button>
      
      <p className="text-sm text-gray-500 mt-4">
        We'll only access your playlists to transfer them. No data is stored permanently.
      </p>
    </div>
  )
} 