import { useToast } from '@/components/ui/use-toast'
import { SizeContentsPage } from '@/lib/types'
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createSize, updateSize, deleteSize } from './actions'

export function useSubmitSizeMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSize,
    onSuccess: async (newSize) => {
      const queryFilter: QueryFilters = {
        queryKey: ['size-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<SizeContentsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0]

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  sizeContents: [newSize, ...firstPage.sizeContents],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            }
          }
        }
      )

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data
        },
      })

      toast({
        description: 'Size created',
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

export function useDeleteSizeMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: deleteSize,
    onSuccess: async (deletedSize) => {
      const queryFilter: QueryFilters = {
        queryKey: ['size-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<SizeContentsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              sizeContents: page.sizeContents.filter(
                (p) => p.id !== deletedSize.id
              ),
            })),
          }
        }
      )

      toast({
        description: 'Size deleted',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete Size. Please try again.',
      })
    },
  })

  return mutation
}

export function useUpdateSizeMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: updateSize,
    onSuccess: async (updatedSize) => {
      const queryFilter = {
        queryKey: ['size-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<SizeContentsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              sizeContents: page.sizeContents.map((p) =>
                p.id === updatedSize.id ? updatedSize : p
              ),
            })),
          }
        }
      )

      toast({
        description: 'Size updated',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to update Size. Please try again.',
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
