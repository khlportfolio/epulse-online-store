import { useToast } from '@/components/ui/use-toast'
import { AboutContentsPage } from '@/lib/types'
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createAbout, deleteAbout, updateAbout } from './actions'

export function useSubmitAboutMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createAbout,
    onSuccess: async (newAbout) => {
      const queryFilter: QueryFilters = {
        queryKey: ['about-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<AboutContentsPage, string | null>
      >(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0]

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                aboutContents: [newAbout, ...firstPage.aboutContents],
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
        description: 'About Content created',
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

export function useDeleteAboutMutation() {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: deleteAbout,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = {
        queryKey: ['about-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<AboutContentsPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            aboutContents: page.aboutContents.filter(
              (p) => p.id !== deletedPost.id
            ),
          })),
        }
      })

      toast({
        description: 'About Content deleted',
      })

      //   if (pathname === `/posts/${deletedPost.id}`) {
      //     router.push(`/users/${deletedPost.user.username}`)
      //   }
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete About Content. Please try again.',
      })
    },
  })

  return mutation
}

export function useUpdateAboutMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: updateAbout,
    onSuccess: async (updatedAbout) => {
      const queryFilter = {
        queryKey: ['about-content', 'for-admin'],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<
        InfiniteData<AboutContentsPage, string | null>
      >(queryFilter, (oldData) => {
        if (!oldData) return

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            aboutContents: page.aboutContents.map((p) =>
              p.id === updatedAbout.id ? updatedAbout : p
            ),
          })),
        }
      })

      toast({
        description: 'About Content updated',
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Failed to update About Content. Please try again.',
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
