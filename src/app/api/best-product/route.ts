import prisma from '@/lib/prisma'
import { getProductDataInclude, ProductContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 3

    const productContents = await prisma.product.findMany({
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: getProductDataInclude(),
      orderBy: [
        { isBestProduct: 'desc' }, // Prioritas pertama: Produk yang memiliki isBestProduct: true
        { sold: 'desc' }, // Prioritas kedua: Produk dengan penjualan terbanyak
      ],
    })

    const nextCursor =
      productContents.length > pageSize ? productContents[pageSize].id : null

    const data: ProductContentsPage = {
      productContents: productContents.slice(0, pageSize),
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
