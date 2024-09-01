import DataFetching from "../DataFetching"
import DialogProduct from "../DialogProduct"

const Page = () => {
    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-primary">Edit Product Shirt Page</h1>
                <DialogProduct />
            </div>
            <div className="container mx-auto py-10">
                <DataFetching />
            </div>
        </div>
    )
}

export default Page