"use client"

import ProductCard from "@/components/ProductCard"
import kyInstance from "@/lib/ky"
import { ProductContentsPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import InfiniteScrollContainer from "./InfiniteScrollContainer"

interface ProductProps {
    categoryId: string
}

const Products = ({ categoryId }: ProductProps) => {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["product-content", "for-you"],
        queryFn: ({ pageParam }) => kyInstance.get(
            `/api/outfit/${categoryId}`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<ProductContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const products = data?.pages.flatMap(page => page.productContents) || [];

    if (status === "pending") {
        return <Loader2 size={30} className="mx-auto animate-spin" />
    }

    if (status === "success" && !products.length && !hasNextPage) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 bg-gray-100">
                <div className="text-center">
                    <div className="inline-block px-4 py-2 mb-4 rounded-full text-white bg-primary text-lg font-semibold animate-pulse">
                        Coming Soon!
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">
                        We are on it!
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Our team is working hard to bring you new products. Stay tuned for updates!
                    </p>
                </div>
            </div>
        )
    }

    if (status === "error") {
        return <p className="text-center text-destructive">
            An error occurred while loading products.
        </p>
    }

    return (
        <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
            <section className="py-3 bg-background px-5 sm:px-14 sm:py-10">
                <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                    Here Are Our Products
                </h2>
                <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} href={`/${categoryId}/${product.id}`} product={product} />
                    ))}
                </div>
            </section>
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
        </InfiniteScrollContainer>
    )
}

export default Products