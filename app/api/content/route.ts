import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Mock data storage (in-memory for now)
let contentItems: any[] = [
  {
    id: uuidv4(),
    title: 'The Future of AI in Business',
    originalContent: 'Article about how AI is transforming business processes and automation...',
    summary: 'AI is revolutionizing how businesses operate by automating routine tasks and enabling data-driven decisions. Companies that adopt AI early gain competitive advantages.',
    insight: 'AI adoption is no longer optional for competitive businesses. The key is to start with high-impact use cases.',
    action: 'Identify 3 high-impact processes in your business where AI could save time or improve accuracy',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Productivity Tips for Remote Work',
    originalContent: 'Guide on optimizing productivity while working from home...',
    summary: 'Effective remote work requires clear routines, dedicated workspace, and proper communication tools. Setting boundaries between work and personal time is crucial.',
    insight: 'Remote workers are often more productive but struggle with work-life balance.',
    action: 'Set specific work hours and establish a dedicated workspace at home',
    status: 'Completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Understanding Cloud Architecture',
    originalContent: 'Technical deep dive into microservices and cloud-native design...',
    summary: 'Microservices architecture allows for independent scaling and deployment of services. Cloud platforms like AWS and GCP abstract infrastructure complexity.',
    insight: 'Microservices are powerful but add operational complexity.',
    action: 'Evaluate if your current monolithic app would benefit from microservices refactoring',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  return NextResponse.json(contentItems)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    // Generate mock summary and insights from the content
    const title = content.split('\n')[0].substring(0, 50) || 'New Idea'
    const newItem = {
      id: uuidv4(),
      title,
      originalContent: content,
      summary: `Summary of: ${title}. Key takeaway: This content provides valuable insights about the topic.`,
      insight: 'This is an important concept that deserves deeper exploration.',
      action: 'Review this idea in context with related topics and plan implementation steps',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }

    contentItems.unshift(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}
