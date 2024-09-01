"use client"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import ProductCard from "@/components/ProductCard"
import kyInstance from "@/lib/ky"
import { ProductContentsPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

const Bookmarks = () => {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["product-feed", "bookmarks"],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/product/bookmarked",
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<ProductContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const products = data?.pages.flatMap(page => page.productContents) || []

    if (status === "pending") {
        return <Loader2 size={30} className="animate-spin mx-auto" />
    }

    if (status === "success" && !products.length && !hasNextPage) {
        return (
            <p className="text-center text-muted-foreground">
                You don&apos;t have any bookmarks yet.
            </p>
        )
    }

    if (status === "error") {
        return <p className="text-center text-destructive">
            An error occurred while loading bookmarks.
        </p>
    }
    return (
        <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} href={`/${product.categoryId}/${product.id}`} />
                ))}
            </div>
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
        </InfiniteScrollContainer>
    )
}

export default Bookmarks