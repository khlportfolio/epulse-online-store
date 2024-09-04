import { useToast } from '@/components/ui/use-toast'
import { ProductContentsPage } from '@/lib/types'
import { MediaType } from '@prisma/client'
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createProduct, deleteProduct, updateProduct } from './actions'

type ProductData = {
  id: string
  title?: string
  price?: number
  categoryId?: string
  features?: string[]
  materials?: string[]
  summary?: string
  detailsSize?: string[]
  sizeStocks?: {
    size: {
      id: string
      name: string
    }
    sizeId: string
    productId: string
    stock: number
  }[]
  attachments?: {
    id: string
    productId: string | null
    type: MediaType
    url: string
    createdAt: Date
  }[]
  bookmarks?: {
    id: string
    userId: string
    productId: string
    createdAt: Date
  }[]
  isBestProduct?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export function useSubmitProductMutation(categoryId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async (newProduct) => {
      const queryFilter: QueryFilters = {
        queryKey: ['product-content', categoryId],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<ProductContentsPage, string | null>
      >(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0]

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                productContents: [newProduct, ...firstPage.productContents],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          } as InfiniteData<ProductContentsPage, string | null>
        }

        return oldData
      })

      queryClient.invalidateQueries(queryFilter)

      toast({
        description: 'Product created',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to Add. Please try again.',
      })
    },
  })

  return mutation
}

export function useDeleteProductMutation(categoryId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async (deletedProduct) => {
      const queryFilter: QueryFilters = {
        queryKey: ['product-content', categoryId],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<ProductContentsPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return oldData

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            productContents: page.productContents.filter(
              (p) => p.id !== deletedProduct.id
            ),
          })),
        }
      })

      queryClient.invalidateQueries(queryFilter)

      toast({
        description: 'Product deleted',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete Product. Please try again.',
      })
    },
  })

  return mutation
}

export function useUpdateProductMutation(categoryId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: async (updatedProduct: ProductData) => {
      const queryFilter: QueryFilters = {
        queryKey: ['product-content', categoryId],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<ProductContentsPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return oldData

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            productContents: page.productContents.map((p) =>
              p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
            ),
          })),
        }
      })

      queryClient.invalidateQueries(queryFilter)

      toast({
        description: 'Product updated',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to update Product. Please try again.',
      })
    },
  })

  return mutation
}
