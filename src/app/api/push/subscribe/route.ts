import { NextRequest, NextResponse } from 'next/server'
import { subscribeUser } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json()

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription is required' },
        { status: 400 }
      )
    }

    const result = await subscribeUser(subscription)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Subscribe API error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
