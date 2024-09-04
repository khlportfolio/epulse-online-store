import Products from "./Products"

interface PageProps {
    params: { categoryId: string }
}

const Page = async ({ params: { categoryId } }: PageProps) => {
    return (
        <Products categoryId={categoryId} />
    )
}

export default Page