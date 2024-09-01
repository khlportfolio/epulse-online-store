import { useToast } from '@/components/ui/use-toast'
import { CategoryContentsPage } from '@/lib/types'
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createCategory, deleteCategory, updateCategory } from './actions'

export function useSubmitCategoryMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async (newCategory) => {
      const queryFilter: QueryFilters = {
        queryKey: ['category-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<CategoryContentsPage, string | null>
      >(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0]

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                categoryContens: [newCategory, ...firstPage.categoryContens],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          }
        }
      })

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data
        },
      })

      toast({
        description: 'Category created',
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

export function useDeleteCategoryMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async (deletedCategory) => {
      const queryFilter: QueryFilters = {
        queryKey: ['category-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<CategoryContentsPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            categoryContens: page.categoryContens.filter(
              (p) => p.id !== deletedCategory.id
            ),
          })),
        }
      })

      toast({
        description: 'Category deleted',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete Category. Please try again.',
      })
    },
  })

  return mutation
}

export function useUpdateCategoryMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: async (updatedCategory) => {
      const queryFilter = {
        queryKey: ['category-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<CategoryContentsPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            categoryContens: page.categoryContens.map((p) =>
              p.id === updatedCategory.id ? updatedCategory : p
            ),
          })),
        }
      })

      toast({
        description: 'Category updated',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to update Category. Please try again.',
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
