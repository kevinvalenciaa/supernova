import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY

    if (!HEYGEN_API_KEY) {
      return NextResponse.json({ success: false, error: 'API key not configured' })
    }

    const response = await fetch('https://api.heygen.com/v2/avatars?limit=1', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY,
      },
    })
    
    const success = response.ok
    
    return NextResponse.json({ success })

  } catch (error: any) {
    console.error('HeyGen API key test error:', error)
    return NextResponse.json({ success: false, error: error.message })
  }
} 