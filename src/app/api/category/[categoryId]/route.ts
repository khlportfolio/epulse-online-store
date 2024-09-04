import prisma from '@/lib/prisma'
import { getProductDataInclude, ProductContentsPage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const category = await prisma.category.findMany({
      where: {
        id: params.categoryId, // Gunakan categoryId dari params untuk filtering
      },
    })
    return NextResponse.json(category)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
