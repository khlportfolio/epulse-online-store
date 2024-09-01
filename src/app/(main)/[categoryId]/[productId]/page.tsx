import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getProductDataInclude } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";
import DetailImagePicker from "./DetailImagePicker";
import AddToBagClient from "./AddToBagClient";

interface PageProps {
    params: { productId: string };
}

interface SizeWithStock {
    id: string;
    name: string;
    stock: number;
}

const getProduct = cache(async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            attachments: true,
            bookmarks: true,
            sizeStocks: {
                include: {
                    size: true,
                },
            },
        },
    });

    if (!product) notFound();

    const sizesWithStock: SizeWithStock[] = product.sizeStocks.map(stock => ({
        id: stock.size.id,
        name: stock.size.name,
        stock: stock.stock,
    }));

    return {
        ...product,
        sizes: sizesWithStock,
    };
});

const getSizes = cache(async () => {
    const sizes = await prisma.size.findMany();
    return sizes;
});

const Page = async ({ params: { productId } }: PageProps) => {
    const product = await getProduct(productId);
    // const sizes = await getSizes();
    const { user } = await validateRequest();

    return (
        <section className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                    <DetailImagePicker
                        mainImage={product.attachments[0]?.url || ''}
                        thumbnailImages={product.attachments}
                    />
                </div>
                <div>
                    <h2 className="text-primary text-3xl font-bold">{product.title}</h2>
                    <h4 className="text-primary text-xl font-semibold">Rp. {product.price}</h4>
                    <AddToBagClient
                        productId={product.id}
                        sizes={product.sizes}
                        initialBookmarkState={product.bookmarks.some((bookmark) => bookmark.userId === user?.id) || false}
                        userId={user?.id || null}
                    />
                    <div className="mt-4">
                        <h2 className="text-muted-foreground text-lg font-semibold mb-2">Details</h2>
                        <hr className="border-muted-foreground border-t-2 w-16 mb-4" />
                        <div className="space-y-4">
                            <h3 className="text-muted-foreground text-base font-medium">{product.title}</h3>
                            {/* <h3 className="text-muted-foreground text-base font-medium">Material: <span className="font-normal">{product.materials}</span></h3> */}
                            <ul className="text-muted-foreground list-disc list-inside">
                                {product.materials.map((product) => (
                                    <li key={product}>{product}</li>
                                ))}
                            </ul>

                            <div>
                                <h4 className="text-muted-foreground text-base font-medium">Fitur:</h4>
                                {/* <p className="text-muted-foreground">{product.features}</p> */}
                                <ul className="text-muted-foreground list-disc list-inside">
                                    {product.features.map((product) => (
                                        <li key={product}>{product}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-muted-foreground text-base font-medium">Ringkasan:</h4>
                                <p className="text-muted-foreground">{product.summary}</p>
                            </div>
                            <div>
                                <h4 className="text-muted-foreground text-base font-medium">Table Ukuran:</h4>
                                <h4 className="text-muted-foreground text-base font-medium">Panjang Badan x Lebar Dada x Lebar Bahu</h4>
                                <ul className="text-muted-foreground list-disc list-inside">
                                    {product.detailsSize.map((product) => (
                                        <li key={product}>{product}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
