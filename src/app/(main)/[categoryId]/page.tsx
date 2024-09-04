import kyInstance from "@/lib/ky"
import Products from "./Products"

interface PageProps {
    params: { categoryId: string }
}
type Category = {
    id: string;
    name: string;
};

const Page = async ({ params: { categoryId } }: PageProps) => {
    const category = await kyInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${categoryId}`).json<Category[]>()
    return (
        <Products categoryId={categoryId} categoryName={category[0].name} />
    )
}

export default Page