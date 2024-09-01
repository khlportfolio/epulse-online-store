// app/(admin)/admin/about-us/actions.ts
'use server'

import prisma from '@/lib/prisma'
import {
  createCategorySchema,
  updateAboutSchema,
  updateCategorySchema,
} from '@/lib/validation'

export async function createCategory(data: { name: string }) {
  // Validate the input using the schema
  const { name } = createCategorySchema.parse(data)

  const newCategory = await prisma.category.create({
    data: {
      name,
    },
  })

  return newCategory
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) throw new Error('Category not found')

  const deletedCategory = await prisma.category.delete({
    where: { id },
  })

  return deletedCategory
}

export async function updateCategory(data: { id: string; name: string }) {
  const { id, name } = updateCategorySchema.parse(data)

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
    },
  })

  return updatedCategory
}
