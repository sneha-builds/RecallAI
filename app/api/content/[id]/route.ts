import { NextRequest, NextResponse } from 'next/server'

// This would normally fetch from a database
// For now we'll return mock data based on the ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['Pending', 'Completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "Pending" or "Completed"' },
        { status: 400 }
      )
    }

    // Mock response - in a real app, update the database
    const updatedItem = {
      id,
      title: 'Updated Content',
      originalContent: 'Original content here',
      summary: 'Summary text',
      insight: 'Insight text',
      action: 'Action steps',
      status,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
