import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const allCategories = await prisma.size.findMany()
  return NextResponse.json(allCategories)
}
