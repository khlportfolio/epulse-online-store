import prisma from '@/lib/prisma'
import { SizeContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 10

    const sizeContents = await prisma.size.findMany({
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor =
      sizeContents.length > pageSize ? sizeContents[pageSize].id : null

    const data: SizeContentsPage = {
      sizeContents: sizeContents,
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
