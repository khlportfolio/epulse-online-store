import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getProductDataInclude, ProductContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || ''
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const searchQuery = q.split(' ').join(' & ')

    const pageSize = 5

    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              search: searchQuery,
            },
          },
        ],
      },
      include: getProductDataInclude(),
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = products.length > pageSize ? products[pageSize].id : null

    const data: ProductContentsPage = {
      productContents: products,
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
