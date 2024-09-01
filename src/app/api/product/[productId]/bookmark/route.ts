import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { BookmarkInfo } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params: { productId } }: { params: { productId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_productId: {
          userId: loggedInUser.id,
          productId,
        },
      },
    })

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params: { productId } }: { params: { productId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.bookmark.upsert({
      where: {
        userId_productId: {
          userId: loggedInUser.id,
          productId,
        },
      },
      create: {
        userId: loggedInUser.id,
        productId,
      },
      update: {},
    })

    return new NextResponse()
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { productId } }: { params: { productId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        productId,
      },
    })

    return new NextResponse()
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
