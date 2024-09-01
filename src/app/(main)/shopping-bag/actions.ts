// actions.ts
'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface CartItemData {
  id: string
  quantity: number
  product: {
    id: string
    title: string
    price: number
    imageUrl: string
  }
  size?: {
    id: string
    name: string
  }
}

export async function getCartItems(): Promise<CartItemData[]> {
  const { user } = await validateRequest()
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user?.id },
    include: {
      product: {
        include: {
          attachments: true,
        },
      },
      size: true, // Include size information
    },
  })

  return cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      imageUrl: item.product.attachments[0]?.url || '',
    },
    size: item.size ? { id: item.size.id, name: item.size.name } : undefined,
  }))
}

export async function deleteCartItem(cartItemId: string): Promise<void> {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('Unauthorized')
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  })

  revalidatePath('/')
}

export async function checkoutAndUpdateStock(cartItems: CartItemData[]) {
  // Iterate through each cart item and reduce stock
  for (const item of cartItems) {
    await prisma.sizeStock.updateMany({
      where: {
        productId: item.product.id,
        sizeId: item.size?.id,
        stock: {
          gte: item.quantity, // Ensure stock is sufficient
        },
      },
      data: {
        stock: {
          decrement: item.quantity, // Reduce stock
        },
      },
    })
    await prisma.product.update({
      where: {
        id: item.product.id,
      },
      data: {
        sold: {
          increment: item.quantity, // Tambahkan jumlah produk yang terjual
        },
      },
    })
  }

  // Additional logic for handling order placement can be added here
}
