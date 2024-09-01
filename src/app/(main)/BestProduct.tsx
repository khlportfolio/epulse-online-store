"use client"

import BestProductCard from "./BestProductCard"
import BestProductImage from "@/assets/signup-image.jpg"
import BestProductImageTwo from "@/assets/man-short.jpg"
import BestProductImageThree from "@/assets/heritage.jpg"
import { useInfiniteQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"
import { ProductContentsPage } from "@/lib/types"
import ProductCard from "@/components/ProductCard"
import AboutUsLoadingSkeleton from "./AboutUsloadingSkeleton"
import ProductLoadingSkeleton from "./ProductLoadingSkeleton"

const BestProduct = () => {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["best-content", "for-admin"],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/best-product",
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<ProductContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const bestProductContents = data?.pages.flatMap(page => page.productContents) || []

    if (status === "pending") {
        return (
            <section className="py-3 bg-background px-5 sm:px-14 sm:py-10">
                <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                    Our Best Product
                </h2>
                <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 mt-10">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <ProductLoadingSkeleton key={idx} />
                    ))}
                </div>
            </section>
        )
    }

    if (status === "success" && !bestProductContents.length && !hasNextPage) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 bg-gray-100">
                <div className="text-center">
                    <div className="inline-block px-4 py-2 mb-4 rounded-full text-white bg-primary text-lg font-semibold animate-pulse">
                        Coming Soon!
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">
                        Best Products
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
            An error occurred while loading best product contents.
        </p>
    }
    return (
        <section className="py-3 bg-background px-5 sm:px-14 sm:py-10">
            <h2 className="text-muted-foreground text-xl md:text-2xl lg:text-4xl font-semibold">
                Our Best Product
            </h2>
            <hr className="border-muted-foreground border-t-2 w-36 mt-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 mt-10">
                {bestProductContents.map((product) => (
                    <ProductCard key={product.id} href={`/${product.categoryId}/${product.id}`} product={product} />
                ))}
                {/* @ts-ignore */}
                {/* <BestProductCard src={BestProductImage} title="Urban Vibes Shirt" description="Embrace the city life with our Urban Vibes Shirt, blending modern style with effortless comfort for a look that stands out." /> */}
                {/* @ts-ignore */}
                {/* <BestProductCard src={BestProductImageTwo} title="Casual Cargo" description="Stay relaxed and ready for anything with our Casual Cargo Pants, combining practicality with laid-back style." /> */}
                {/* @ts-ignore */}
                {/* <BestProductCard src={BestProductImageThree} title="Heritage Pocket" description="Timeless and versatile, our Heritage Pocket Tee offers a classic look with a modern touch of functionality." /> */}
            </div>
        </section>
    )
}

export default BestProduct