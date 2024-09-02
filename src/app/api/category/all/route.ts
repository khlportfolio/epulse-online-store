import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const allCategories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return NextResponse.json(allCategories)
}
