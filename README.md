# 🎵 PlayDaddy

Transfer your Spotify playlists to YouTube Music seamlessly.

## Features

- 🔐 Secure OAuth2 authentication with Spotify
- 📋 Browse and select from your Spotify playlists
- 🎯 Automatic song matching on YouTube Music
- 📱 Modern, responsive UI
- ⚡ Real-time transfer progress tracking
- 📊 Detailed success/failure reporting

## How It Works

1. **Connect Spotify**: Login with your Spotify account using OAuth2
2. **Select Playlist**: Browse and choose a playlist to transfer
3. **Match Songs**: Automatically find each song on YouTube Music
4. **Create Playlist**: Generate a new YouTube Music playlist with matched tracks

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Spotify Developer Account
- Google Cloud Console Account

### 1. Clone and Install

```bash
git clone <repository-url>
cd PlayDaddy
npm install
```

### 2. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/api/spotify/callback` to Redirect URIs
4. Copy your Client ID and Client Secret

### 3. YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key and OAuth 2.0 Client ID)
5. Add `http://localhost:3000/api/youtube/callback` to OAuth redirect URIs
6. Copy your API Key, Client ID, and Client Secret

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Spotify Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube Configuration
YOUTUBE_API_KEY=AIzaSyDJFoXZaBThZ_cMVy9MTYIjdOWv6M-S73I
YOUTUBE_CLIENT_ID=272035414321-kotm31q4t2voimjtk1cf1p4883btqlb7.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

### Spotify Routes
- `GET /api/spotify/auth-url` - Get Spotify OAuth URL
- `GET /api/spotify/callback` - Handle OAuth callback
- `POST /api/spotify/token` - Exchange code for access token
- `POST /api/spotify/playlists` - Fetch user's playlists
- `POST /api/spotify/playlist-tracks` - Fetch playlist tracks

### YouTube Routes
- `POST /api/youtube/search-track` - Search for tracks on YouTube
- `POST /api/youtube/create-playlist` - Create YouTube playlist
- `GET /api/youtube/callback` - Handle OAuth callback
- `POST /api/youtube/token` - Exchange code for access token

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **APIs**: Spotify Web API, YouTube Data API v3
- **Authentication**: OAuth2 for both Spotify and YouTube
- **Styling**: Tailwind CSS with custom components

## Security Features

- OAuth2 authentication for both platforms
- No permanent storage of user credentials
- Secure token exchange
- Private playlist creation by default
- CORS protection

## Limitations

- YouTube Music doesn't have a public API, so we use YouTube search
- Some songs may not be found due to different naming conventions
- YouTube playlists are created as private by default
- Rate limiting may apply to API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
