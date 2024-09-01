'use server'

import prisma from '@/lib/prisma'

export async function getCartItemsCount(
  userId: string | null
): Promise<number> {
  if (!userId) return 0

  const count = await prisma.cartItem.count({
    where: {
      userId,
    },
  })

  return count
}
