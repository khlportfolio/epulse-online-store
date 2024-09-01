"use client"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { AboutContentsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import AboutUsLoadingSkeleton from "./AboutUsloadingSkeleton";

const AboutUs = () => {
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["about-content", "for-admin"],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/about-us",
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<AboutContentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const aboutContents = data?.pages.flatMap(page => page.aboutContents) || []

    if (status === "pending") {
        return <AboutUsLoadingSkeleton />
    }

    if (status === "success" && !aboutContents.length && !hasNextPage) {
        return (
            <p className="text-center text-muted-foreground">
                Abous us is coming soon.
            </p>
        )
    }

    if (status === "error") {
        return <p className="text-center text-destructive">
            An error occurred while loading about contents.
        </p>
    }
    return (
        <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
            <section className="bg-gray-100 py-10 px-5">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-8">

                    {aboutContents.map((about) => (
                        <div key={about.id} className="flex-1 min-w-[300px] p-5 bg-white rounded-lg shadow-lg">
                            <h2 className="text-muted-foreground text-2xl font-semibold mb-4">{about.title}</h2>
                            <p className="text-muted-foreground text-base">
                                {about.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </InfiniteScrollContainer>
    );
}

export default AboutUs;