"use client"

import { useSession } from "@/app/(main)/SessionProvider";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavoriteProps {
    size: number;
}

const Favorite = ({ size }: FavoriteProps) => {
    const { user } = useSession();
    const router = useRouter();

    function handleClick() {
        if (!user) {
            router.push("/login")
        } else {
            router.push("/bookmarks")
        }
    }
    return (
        <Heart size={size} className="text-muted-foreground cursor-pointer" onClick={handleClick} />
    )
}

export default Favorite