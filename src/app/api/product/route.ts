import prisma from '@/lib/prisma'
import { getProductDataInclude, ProductContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined
    const categoryId = req.nextUrl.searchParams.get('categoryId') || undefined

    const pageSize = 10

    const productContents = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {}, // Filter berdasarkan categoryId jika tersedia
      cursor: cursor ? { id: cursor } : undefined,
      include: getProductDataInclude(),
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
