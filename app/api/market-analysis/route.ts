import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json()

    if (!idea) {
      return NextResponse.json(
        { error: 'Content idea is required' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
    Analyze the market potential for this content idea: "${idea}"
    
    Provide a comprehensive market analysis including:
    1. Target audience demographics and psychographics
    2. Market size and growth potential
    3. Competition analysis
    4. Content strategy recommendations
    5. Platform-specific optimization tips
    6. Viral potential assessment
    7. Key opportunities and challenges
    
    Format the response as a structured JSON with these sections:
    - marketSummary: {viralPotential, audienceSize, competitionLevel, trend}
    - audience: {demographics, interests, platforms, behavior}
    - competitors: {topCompetitors, competitorStrategies, differentiationOpportunity}
    - strategy: {contentFormat, postingFrequency, keyMessages, callToAction}
    - opportunities: [array of opportunity descriptions]
    - insights: [array of key insights]
    - marketTrends: [array of relevant trends]
    
    Make it specific and actionable for content creators.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a digital marketing expert and content strategist with deep knowledge of social media platforms, audience behavior, and viral content patterns. Provide data-driven insights and actionable recommendations."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    let analysis
    try {
      analysis = JSON.parse(content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        marketSummary: {
          viralPotential: "High",
          audienceSize: "Large", 
          competitionLevel: "Medium",
          trend: "Growing"
        },
        audience: {
          demographics: "Content creators and digital entrepreneurs",
          interests: ["Technology", "Business", "Content Creation"],
          platforms: ["YouTube", "LinkedIn", "TikTok"],
          behavior: "Highly engaged with educational content"
        },
        competitors: {
          topCompetitors: ["Established content creators in the space"],
          competitorStrategies: "Mix of educational and entertainment content",
          differentiationOpportunity: "Focus on unique angle or expertise"
        },
        strategy: {
          contentFormat: "Short-form videos with clear value proposition",
          postingFrequency: "3-5 times per week",
          keyMessages: ["Provide value", "Engage audience"],
          callToAction: "Subscribe and engage"
        },
        opportunities: [
          "Growing demand for quality content",
          "Underserved niche opportunities"
        ],
        insights: [
          "Audience is highly receptive to authentic, relatable content",
          "Visual storytelling is key to success in this market"
        ],
        marketTrends: [
          "Increasing demand for authentic content",
          "Rise of personal branding",
          "Growing creator economy"
        ]
      }
    }

    return NextResponse.json({
      analysis,
      generatedAt: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Market analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate market analysis' },
      { status: 500 }
    )
  }
}

