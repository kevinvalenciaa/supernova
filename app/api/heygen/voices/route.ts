import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY

    if (!HEYGEN_API_KEY) {
      return NextResponse.json({ voices: [] })
    }

    const response = await fetch('https://api.heygen.com/v2/voices', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY,
      },
    })
    
    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      voices: data.data?.voices || []
    })

  } catch (error: any) {
    console.error('HeyGen voices error:', error)
    return NextResponse.json({ voices: [] })
  }
} 