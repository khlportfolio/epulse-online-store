'use server'

import prisma from '@/lib/prisma'
import { createSizeSchema, updateSizeSchema } from '@/lib/validation'

export async function createSize(data: { name: string }) {
  // Validate the input using the schema
  const { name } = createSizeSchema.parse(data)

  const newSize = await prisma.size.create({
    data: {
      name,
    },
  })

  return newSize
}

export async function deleteSize(id: string) {
  const size = await prisma.size.findUnique({
    where: { id },
  })

  if (!size) throw new Error('Size not found')

  const deletedSize = await prisma.size.delete({
    where: { id },
  })

  return deletedSize
}

export async function updateSize(data: { id: string; name: string }) {
  const { id, name } = updateSizeSchema.parse(data)

  const updatedSize = await prisma.size.update({
    where: { id },
    data: {
      name,
    },
  })

  return updatedSize
}
