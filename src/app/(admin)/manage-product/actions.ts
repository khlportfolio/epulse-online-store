'use server'

import prisma from '@/lib/prisma'
import { createProductSchema, updateProductSchema } from '@/lib/validation'
import { MediaType } from '@prisma/client'

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
  isBestProduct: Boolean
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
    isBestProduct,
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
      isBestProduct,
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

export async function updateProduct(data: {
  id: string
  title?: string
  price?: number
  categoryId?: string
  features?: string[]
  materials?: string[]
  summary?: string
  detailsSize?: string[]
  sizeStocks?: { sizeId: string; stock: number }[]
  isBestProduct?: boolean
  mediaIds?: string[]
}) {
  const {
    id,
    title,
    price,
    categoryId,
    features,
    materials,
    summary,
    detailsSize,
    sizeStocks,
    isBestProduct,
    mediaIds,
  } = updateProductSchema.parse(data)

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      attachments: true,
      sizeStocks: { include: { size: true } },
      bookmarks: true,
    },
  })

  if (!existingProduct) throw new Error('Product not found')

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      title: title ?? existingProduct.title,
      price: price ?? existingProduct.price,
      categoryId: categoryId ?? existingProduct.categoryId,
      features: features ?? existingProduct.features,
      materials: materials ?? existingProduct.materials,
      summary: summary ?? existingProduct.summary,
      detailsSize: detailsSize ?? existingProduct.detailsSize,
      sizeStocks: sizeStocks
        ? {
            upsert: sizeStocks.map((sizeStock) => ({
              where: {
                sizeId_productId: { sizeId: sizeStock.sizeId, productId: id },
              },
              update: { stock: sizeStock.stock },
              create: { sizeId: sizeStock.sizeId, stock: sizeStock.stock },
            })),
          }
        : undefined,
      isBestProduct: isBestProduct ?? existingProduct.isBestProduct,
      attachments: mediaIds
        ? { set: mediaIds.map((id) => ({ id })) }
        : undefined,
    },
    include: {
      attachments: true,
      sizeStocks: { include: { size: true } },
    },
  })

  return {
    ...updatedProduct,
    bookmarks: existingProduct.bookmarks,
    sizeStocks: updatedProduct.sizeStocks.map((stock) => ({
      ...stock,
      size: {
        id: stock.size.id,
        name: stock.size.name,
      },
    })),
  }
}
