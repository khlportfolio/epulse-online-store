import { Skeleton } from "@/components/ui/skeleton"

const ProductLoadingSkeleton = () => {
    return (
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
            <Skeleton className="h-48 w-full rounded-md" /> {/* Placeholder for image */}
            <div className="mt-4 w-full space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" /> {/* Placeholder for title */}
                <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Placeholder for price */}
                <Skeleton className="h-4 w-full rounded-md" /> {/* Placeholder for description */}
            </div>
        </div>
    )
}

export default ProductLoadingSkeleton
