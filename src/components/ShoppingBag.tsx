"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import { Loader2, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCartItemsCount } from "@/app/(main)/actions";

interface ShoppingBagProps {
    size: number;
}

const ShoppingBag = ({ size }: ShoppingBagProps) => {
    const { user } = useSession();
    const router = useRouter();
    const [itemCount, setItemCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCartItemCount() {
            if (user?.id) {
                try {
                    const count = await getCartItemsCount(user.id);
                    setItemCount(count);
                } catch (error) {
                    console.error("Failed to fetch cart item count:", error);
                }
            }
            setIsLoading(false);
        }

        fetchCartItemCount();
    }, [user]);

    function handleClick() {
        if (!user) {
            router.push("/login");
        } else {
            router.push("/shopping-bag");
        }
    }

    if (isLoading) {
        return <Loader2 size={13} className="animate-spin" />;
    }

    return (
        <div className="relative">
            <ShoppingBagIcon
                size={size}
                className="text-muted-foreground cursor-pointer"
                onClick={handleClick}
            />
            {itemCount > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary text-background rounded-full px-2 py-1 text-xs">
                    {itemCount}
                </span>
            )}
        </div>
    );
};

export default ShoppingBag;
