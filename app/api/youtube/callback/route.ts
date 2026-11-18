import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  if (error) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>YouTube Auth Error</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'YOUTUBE_AUTH_ERROR',
              error: '${error}'
            }, '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}');
            window.close();
          </script>
        </body>
      </html>
    `
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  }

  if (!code) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>YouTube Auth Error</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'YOUTUBE_AUTH_ERROR',
              error: 'No authorization code received'
            }, '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}');
            window.close();
          </script>
        </body>
      </html>
    `
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>YouTube Auth Success</title>
      </head>
      <body>
        <script>
          window.opener.postMessage({
            type: 'YOUTUBE_AUTH_SUCCESS',
            code: '${code}',
            state: '${state}'
          }, '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      </body>
    </html>
  `

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
} 