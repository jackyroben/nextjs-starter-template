import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeUser } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json()

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription is required' },
        { status: 400 }
      )
    }

    const result = await unsubscribeUser(subscription)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Unsubscribe API error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}
