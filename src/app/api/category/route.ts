import prisma from '@/lib/prisma'
import { CategoryContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 10

    const categoryContents = await prisma.category.findMany({
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor =
      categoryContents.length > pageSize ? categoryContents[pageSize].id : null

    const data: CategoryContentsPage = {
      categoryContens: categoryContents.slice(0, pageSize),
      nextCursor,
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
