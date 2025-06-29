import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { query, perPage = 5, orientation = 'landscape' } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}`, {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY || ''
      }
    })
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      videos: data.videos || []
    })

  } catch (error: any) {
    console.error('Pexels search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search videos' },
      { status: 500 }
    )
  }
} 