'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface AddToBagActionProps {
  userId: string
  productId: string
  sizeId: string
  quantity?: number
}

export const addToBagAction = async ({
  userId,
  productId,
  sizeId,
  quantity,
}: AddToBagActionProps) => {
  await prisma.cartItem.create({
    data: {
      userId,
      productId,
      sizeId,
      quantity,
    },
  })

  revalidatePath('/') // Revalidate the page to reflect the updated cart
}
