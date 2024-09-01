import { useToast } from '@/components/ui/use-toast'
import { ProductContentsPage } from '@/lib/types'
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createProduct, deleteProduct } from './actions'

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
