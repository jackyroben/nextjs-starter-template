import { NextRequest, NextResponse } from 'next/server'
import { sendNotification } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    const { message, title, subscription } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const result = await sendNotification(message, subscription)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Send notification API error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
