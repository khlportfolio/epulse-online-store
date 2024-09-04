import { Prisma } from '@prisma/client'

export type AboutData = Prisma.AboutUsGetPayload<{}>

export interface AboutContentsPage {
  aboutContents: AboutData[]
  nextCursor: string | null
}

export type CategoryData = Prisma.CategoryGetPayload<{}>

export interface CategoryContentsPage {
  categoryContens: CategoryData[]
  nextCursor: string | null
}

export type AllCategoriesData = {
  name: string
}

export type SizeData = Prisma.SizeGetPayload<{}>

export interface SizeContentsPage {
  sizeContents: SizeData[]
  nextCursor: string | null
}

export function getProductDataInclude(loggedInUserId?: string) {
  return {
    attachments: true,
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    sizeStocks: {
      include: {
        size: true, // pastikan kita dapatkan data ukuran juga
      },
    },
  } satisfies Prisma.ProductInclude
}

export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>
}>

export interface ProductContentsPage {
  productContents: ProductData[]
  nextCursor: string | null
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean
}
