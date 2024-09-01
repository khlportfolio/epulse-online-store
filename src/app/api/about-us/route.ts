import prisma from '@/lib/prisma'
import { AboutContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 2

    const aboutContents = await prisma.aboutUs.findMany({
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor =
      aboutContents.length > pageSize ? aboutContents[pageSize].id : null

    const data: AboutContentsPage = {
      aboutContents: aboutContents.slice(0, pageSize),
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
