import DataFetching from "../DataFetching"
import DialogProduct from "../DialogProduct"

interface PageProps {
    params: { categoryId: string }
}

const Page = ({ params: { categoryId } }: PageProps) => {
    return (
        <div className="w-full">
            <div className="flex flex-row items-center justify-between w-full ">
                <h1 className="text-xl md:text-2xl font-semibold text-primary">Edit Product For Your Store</h1>
                <div className="mt-4 md:mt-0">
                    <DialogProduct categoryId={categoryId} />
                </div>
            </div>
            <div className="w-full py-6 md:py-10 ">
                <DataFetching categoryId={categoryId} />
            </div>
        </div>
    )
}

export default Page
