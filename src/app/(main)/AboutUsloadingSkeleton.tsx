import { Skeleton } from "@/components/ui/skeleton"

export default function AboutUsLoadingSkeleton() {
    return (
        <section className="bg-background py-10 px-5">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-8">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="flex-1 min-w-[300px] p-5 bg-white rounded-lg shadow-lg flex flex-col gap-y-4">
                        <Skeleton className="w-3/5 h-5 rounded" />
                        <Skeleton className="w-full h-5 rounded" />
                        <Skeleton className="w-full h-5 rounded" />
                    </div>
                ))}
            </div>
        </section>
    )
}
