import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Media } from "@prisma/client";
import { ProductData } from "@/lib/types";
import BookmarkButton from "./BookmarkButton";
import { validateRequest } from "@/auth";
import { useSession } from "@/app/(main)/SessionProvider";

interface ProductCardProps {
    product: ProductData
    href: string
}

const ProductCard = ({ product, href }: ProductCardProps) => {
    // const { user } = await validateRequest();
    const { user } = useSession();
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 max-w-xs mx-auto">
            <Link href={href} className="block">
                <div className="relative w-72 h-72">
                    {product.attachments.length > 0 && product.attachments[0].url && (
                        <Image
                            src={product.attachments[0].url}
                            alt={product.title}
                            fill
                            className="w-full h-full object-cover"
                        />
                        // <img src={product.attachments[0].url} alt={product.title} className="w-full h-full object-cover" />
                    )}
                </div>
            </Link>
            <div className="p-5">
                <div className="flex items-center gap-3 justify-between mb-1">
                    <Link href={href} className="flex-1">
                        <h3 className="text-primary text-base">
                            {product.title}
                        </h3>
                        <p className="text-foreground text-sm">
                            Rp. {product.price}
                        </p>
                    </Link>
                    <button className="p-1 bg-white rounded-full shadow-md">
                        {user && (
                            <BookmarkButton
                                productId={product.id}
                                initialState={{
                                    isBookmarkedByUser: product.bookmarks.some((bookmark) => bookmark.userId === user.id),
                                }}
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard