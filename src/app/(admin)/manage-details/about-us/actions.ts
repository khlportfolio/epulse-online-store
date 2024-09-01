// app/(admin)/admin/about-us/actions.ts
'use server'

import prisma from '@/lib/prisma'
import { createAboutSchema, updateAboutSchema } from '@/lib/validation'

export async function createAbout(data: {
  title: string
  description: string
}) {
  // Validate the input using the schema
  const { title, description } = createAboutSchema.parse(data)

  const newAbout = await prisma.aboutUs.create({
    data: {
      title,
      description,
    },
  })

  return newAbout
}

export async function deleteAbout(id: string) {
  const aboutContent = await prisma.aboutUs.findUnique({
    where: { id },
  })

  if (!aboutContent) throw new Error('About content not found')

  const deletedPost = await prisma.aboutUs.delete({
    where: { id },
  })

  return deletedPost
}

export async function updateAbout(data: {
  id: string
  title: string
  description: string
}) {
  const { id, title, description } = updateAboutSchema.parse(data)

  const updatedAbout = await prisma.aboutUs.update({
    where: { id },
    data: {
      title,
      description,
    },
  })

  return updatedAbout
}
