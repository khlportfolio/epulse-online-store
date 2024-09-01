import DataFetching from "../DataFetching"
import DialogProduct from "../DialogProduct"

interface PageProps {
    params: { categoryId: string }
}

const Page = ({ params: { categoryId } }: PageProps) => {
    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-primary">Edit Product For Your Store</h1>
                <DialogProduct categoryId={categoryId} />
            </div>
            <div className="container mx-auto py-10">
                <DataFetching categoryId={categoryId} />
            </div>
        </div>
    )
}

export default Page
