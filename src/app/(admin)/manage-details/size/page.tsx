import DataFetching from "./DataFetching"
import DialogSize from "./DialogSize"

const Page = () => {
    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-primary">Edit Size Page</h1>
                <DialogSize />
            </div>
            <div className="container mx-auto py-10">
                <DataFetching />
            </div>
        </div>
    )
}

export default Page