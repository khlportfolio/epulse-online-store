import { NextResponse } from 'next/server'
import { validateRequest } from '@/auth'
import { getCartItemsCount } from '@/app/(main)/actions'

export async function POST(request: Request) {
  const { user } = await validateRequest()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await request.json()

  if (userId !== user.id) {
    return NextResponse.json({ error: 'Invalid user' }, { status: 403 })
  }

  try {
    const count = await getCartItemsCount(userId)
    if (count === 0) {
      return NextResponse.json({ count: 0 }) // Return an empty count to avoid unexpected end of JSON input error
    }
    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cart item count' },
      { status: 500 }
    )
  }
}
