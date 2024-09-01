'use server'

import prisma from '@/lib/prisma'
import { createProductSchema, updateProductSchema } from '@/lib/validation'

export async function createProduct(data: {
  title: string
  price: number
  categoryId: string
  features: string[]
  materials: string[]
  summary: string
  detailsSize: string[]
  sizeStocks: { sizeId: string; stock: number }[]
  mediaIds: string[]
}) {
  // Validate the input using the schema
  const {
    title,
    price,
    categoryId,
    features,
    materials,
    summary,
    detailsSize,
    sizeStocks,
    mediaIds,
  } = createProductSchema.parse(data)

  const newProduct = await prisma.product.create({
    data: {
      title,
      price,
      categoryId,
      features,
      materials,
      summary,
      detailsSize,
      sizeStocks: {
        create: sizeStocks.map((sizeStock) => ({
          sizeId: sizeStock.sizeId,
          stock: sizeStock.stock,
        })),
      },
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
  })

  return newProduct
}

export async function deleteProduct(id: string) {
  // Pastikan produk ada
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      sizeStocks: true, // Sertakan relasi sizeStocks jika ada
    },
  })

  if (!product) throw new Error('Product not found')

  // Hapus sizeStocks terkait
  await prisma.sizeStock.deleteMany({
    where: { productId: id },
  })

  // Hapus produk
  const deletedProduct = await prisma.product.delete({
    where: { id },
  })

  return deletedProduct
}
