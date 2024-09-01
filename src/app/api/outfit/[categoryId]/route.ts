import prisma from '@/lib/prisma'
import { getProductDataInclude, ProductContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined
    const pageSize = 8
    const { categoryId } = params // Ambil categoryId dari params

    const products = await prisma.product.findMany({
      where: {
        categoryId, // Gunakan categoryId dari params untuk filtering
      },
      include: getProductDataInclude(),
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = products.length > pageSize ? products[pageSize].id : null

    const data: ProductContentsPage = {
      productContents: products.slice(0, pageSize),
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
